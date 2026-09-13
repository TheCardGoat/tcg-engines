export interface EmptyZoneProps {
  label?: string;
  count?: string;
}

export function EmptyZone({ label = "Empty", count }: EmptyZoneProps) {
  return (
    <div className="empty-zone grid min-h-[60px] place-items-center rounded-md border border-dashed border-[var(--board-border)] bg-[var(--board-surface-soft)] px-1.5 py-2">
      <span className="whitespace-nowrap text-[10px] font-bold text-[var(--board-muted)]">
        {label}
        {count !== undefined && <span className="ml-1">({count})</span>}
      </span>
    </div>
  );
}
