interface FilterChipProps {
  label: string;
  active?: boolean;
}

export function FilterChip({ label, active }: FilterChipProps) {
  return (
    <button
      type="button"
      className={`rounded-full px-4 py-1 text-sm transition ${
        active ? "bg-foreground text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {label}
    </button>
  );
}
