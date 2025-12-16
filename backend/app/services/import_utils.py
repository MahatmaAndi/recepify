from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Iterable, List, Optional, Sequence
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup
from openai import OpenAI
from pydantic import BaseModel, ConfigDict, Field

from ..config import get_settings


def clean_text(value: Optional[str]) -> str:
    if not value:
        return ""
    return re.sub(r"\s+", " ", value).strip()


def safe_list(value: Any) -> List[Any]:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def ensure_domain(url: str) -> str:
    parsed = urlparse(url)
    return parsed.netloc or url

ISO_DURATION_PATTERN = re.compile(
    r"^P(?:(?P<days>\d+)D)?(?:T(?:(?P<hours>\d+)H)?(?:(?P<minutes>\d+)M)?(?:(?P<seconds>\d+)S)?)?$",
    re.IGNORECASE,
)

def normalize_iso_duration(value: Any) -> Optional[str]:
    if value is None:
        return None
    normalized = str(value).strip()
    if not normalized:
        return None

    match = ISO_DURATION_PATTERN.match(normalized)
    if not match:
        return normalized

    components: List[str] = []
    for unit, label in (
        ("days", "d"),
        ("hours", "h"),
        ("minutes", "min"),
        ("seconds", "s"),
    ):
        part = match.group(unit)
        if part:
            number = int(part)
            if number:
                components.append(f"{number} {label}")

    if not components:
        return "0 min"

    return " ".join(components)


def _httpx_client() -> httpx.Client:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "de,en;q=0.8",
    }
    return httpx.Client(headers=headers, timeout=30.0, follow_redirects=True)


def fetch_html(url: str) -> str:
    with _httpx_client() as client:
        response = client.get(url)
        response.raise_for_status()
        return response.text


def extract_og_image(html: str) -> Optional[str]:
    soup = BeautifulSoup(html, "html.parser")
    og = soup.find("meta", attrs={"property": "og:image"})
    if og and og.get("content"):
        return og["content"].strip()
    return None


def extract_json_ld_blocks(html: str) -> List[Any]:
    soup = BeautifulSoup(html, "html.parser")
    blocks: List[Any] = []
    for script in soup.find_all("script", attrs={"type": re.compile(r"application/ld\+json", re.I)}):
        raw = script.string
        if not raw:
            continue
        raw = raw.strip()
        try:
            blocks.append(json.loads(raw))
        except json.JSONDecodeError:
            continue
    return blocks


def find_recipe_nodes(value: Any) -> List[dict[str, Any]]:
    nodes: List[dict[str, Any]] = []

    def is_recipe(node: Any) -> bool:
        if not isinstance(node, dict):
            return False
        node_type = node.get("@type")
        if isinstance(node_type, str):
            return node_type.lower() == "recipe"
        if isinstance(node_type, list):
            return any(isinstance(entry, str) and entry.lower() == "recipe" for entry in node_type)
        return False

    def walk(item: Any) -> None:
        if isinstance(item, dict):
            if is_recipe(item):
                nodes.append(item)
            if "@graph" in item:
                walk(item["@graph"])
            for child in item.values():
                walk(child)
        elif isinstance(item, list):
            for child in item:
                walk(child)

    walk(value)
    return nodes


def pick_best_recipe(nodes: Sequence[dict[str, Any]]) -> Optional[dict[str, Any]]:
    if not nodes:
        return None

    def score(node: dict[str, Any]) -> int:
        missing = 0
        if not node.get("name"):
            missing += 1
        if not node.get("recipeIngredient"):
            missing += 1
        if not node.get("recipeInstructions"):
            missing += 1
        return missing

    return sorted(nodes, key=score)[0]


def resolve_schema_image(node: dict[str, Any]) -> Optional[str]:
    image = node.get("image")
    if isinstance(image, str):
        return image.strip()
    if isinstance(image, list) and image:
        first = image[0]
        if isinstance(first, str):
            return first.strip()
        if isinstance(first, dict) and first.get("url"):
            return str(first["url"]).strip()
    if isinstance(image, dict) and image.get("url"):
        return str(image["url"]).strip()
    return None


def extract_page_text(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "noscript", "svg", "canvas", "iframe"]):
        tag.decompose()
    text = soup.get_text("\n", strip=True)
    lines = [clean_text(line) for line in text.split("\n")]
    lines = [line for line in lines if len(line) >= 2]
    return "\n".join(lines)


class ImportedIngredient(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    line: str
    amount: Optional[str] = None
    name: Optional[str] = None


class ImportedInstruction(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    step_number: int = Field(alias="stepNumber")
    text: str


class ImportedRecipe(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    title: str
    description: Optional[str] = None
    meal_type: Optional[str] = Field(default=None, alias="mealType")
    difficulty: Optional[str] = None

    prep_time: Optional[str] = Field(default=None, alias="prepTime")
    cook_time: Optional[str] = Field(default=None, alias="cookTime")
    total_time: Optional[str] = Field(default=None, alias="totalTime")
    servings: Optional[str] = None

    nutrition_calories: Optional[str] = Field(default=None, alias="nutritionCalories")
    nutrition_protein: Optional[str] = Field(default=None, alias="nutritionProtein")
    nutrition_carbs: Optional[str] = Field(default=None, alias="nutritionCarbs")
    nutrition_fat: Optional[str] = Field(default=None, alias="nutritionFat")

    chef_notes: Optional[str] = Field(default=None, alias="chefNotes")

    source_platform: str = Field(alias="sourcePlatform")
    source_url: str = Field(alias="sourceUrl")
    source_domain: str = Field(alias="sourceDomain")
    extracted_via: Optional[str] = Field(default=None, alias="extractedVia")

    media_video_url: Optional[str] = Field(default=None, alias="mediaVideoUrl")
    media_image_url: Optional[str] = Field(default=None, alias="mediaImageUrl")
    media_local_path: Optional[str] = Field(default=None, alias="mediaLocalPath")

    tags: List[str] = Field(default_factory=list)
    ingredients: List[ImportedIngredient] = Field(default_factory=list)
    instructions: List[ImportedInstruction] = Field(default_factory=list)

    metadata: dict[str, Any] = Field(default_factory=dict)

    def model_dump_recipe(self) -> dict[str, Any]:
        return self.model_dump(by_alias=True, exclude_none=True)


def ingredients_from_strings(lines: Iterable[str]) -> List[ImportedIngredient]:
    items: List[ImportedIngredient] = []
    for raw in lines:
        cleaned = clean_text(str(raw))
        if not cleaned:
            continue
        items.append(ImportedIngredient(line=cleaned))
    return items


def instructions_from_strings(lines: Iterable[str]) -> List[ImportedInstruction]:
    steps: List[ImportedInstruction] = []
    for idx, raw in enumerate(lines, start=1):
        cleaned = clean_text(str(raw))
        if not cleaned:
            continue
        steps.append(ImportedInstruction(stepNumber=idx, text=cleaned))
    return steps


def get_openai_client() -> OpenAI:
    settings = get_settings()
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured.")
    return OpenAI(api_key=settings.openai_api_key)


def ensure_storage_path(*parts: str, is_file: bool = False) -> Path:
    settings = get_settings()
    target = settings.storage_dir.joinpath(*parts)
    if is_file:
        target.parent.mkdir(parents=True, exist_ok=True)
    else:
        target.mkdir(parents=True, exist_ok=True)
    return target
