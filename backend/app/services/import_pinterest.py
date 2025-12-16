from __future__ import annotations

from typing import Dict, List
from urllib.parse import parse_qs, unquote, urlparse

from bs4 import BeautifulSoup

from .import_utils import (
    ImportedRecipe,
    ensure_domain,
    extract_json_ld_blocks,
    extract_og_image,
    fetch_html,
    find_recipe_nodes,
    pick_best_recipe,
    resolve_schema_image,
)
from .import_web import _openai_from_page, _schema_to_recipe


def _extract_destination_url(pin_html: str) -> Optional[str]:
    soup = BeautifulSoup(pin_html, "html.parser")
    for link in soup.find_all("a", href=True):
        href = link["href"]
        if "outgoing" in href and "url=" in href:
            qs = parse_qs(urlparse(href).query)
            if "url" in qs and qs["url"]:
                return unquote(qs["url"][0])

    external_links: List[str] = []
    for link in soup.find_all("a", href=True):
        href = link["href"].strip()
        if href.startswith("//"):
            href = "https:" + href
        if href.startswith("http"):
            host = urlparse(href).netloc.lower()
            if "pinterest." not in host and "pinimg." not in host:
                external_links.append(href)
    return external_links[0] if external_links else None


def import_pinterest(url: str) -> Dict[str, Any]:
    pin_html = fetch_html(url)
    pin_image = extract_og_image(pin_html)
    destination_url = _extract_destination_url(pin_html)

    recipe: ImportedRecipe
    if not destination_url:
        recipe = _openai_from_page(
            url=url,
            html=pin_html,
            image_url=pin_image,
            platform="pinterest",
            extracted_via_label="openai_from_pinterest_pin",
        )
    else:
        dest_html = fetch_html(destination_url)
        dest_image = extract_og_image(dest_html) or pin_image

        schema_nodes: List[dict[str, Any]] = []
        for block in extract_json_ld_blocks(dest_html):
            schema_nodes.extend(find_recipe_nodes(block))

        best_node = pick_best_recipe(schema_nodes)
        if best_node:
            image = resolve_schema_image(best_node) or dest_image
            recipe = _schema_to_recipe(
                best_node,
                url=url,
                image_url=image,
                platform="pinterest",
                extracted_via="pinterest_destination_schema",
            )
        else:
            recipe = _openai_from_page(
                url=url,
                html=dest_html,
                image_url=dest_image,
                platform="pinterest",
                extracted_via_label="pinterest_destination_openai",
            )

        recipe.metadata["destinationUrl"] = destination_url
        recipe.metadata["destinationDomain"] = ensure_domain(destination_url)

    data = recipe.model_dump_recipe()
    data.setdefault("tags", [])
    return data
