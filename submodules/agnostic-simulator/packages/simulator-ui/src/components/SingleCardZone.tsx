import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { CardFace } from "./CardFace";
import { EmptyZone } from "./EmptyZone";

export interface SingleCardZoneProps {
  zone: SimulatorZone | undefined;
  entities: SimulatorEntity[];
  entityCount: number;
  label?: string;
  emptyLabel?: string;
  density?: "mini" | "compact" | "normal";
  selectedId?: string;
  showCount?: boolean;
  className?: string;
  onSelect?: (entity: SimulatorEntity) => void;
}

export function SingleCardZone({
  zone,
  entities,
  entityCount,
  label,
  emptyLabel,
  density = "mini",
  selectedId,
  showCount = false,
  className,
  onSelect,
}: SingleCardZoneProps) {
  const entity = entities[0];
  const resolvedLabel = label ?? zone?.label ?? "Card slot";
  const resolvedEmptyLabel = emptyLabel ?? resolvedLabel;

  return (
    <div
      className={cx(
        "single-card-zone relative grid min-h-[106px] w-[76px] place-items-center overflow-hidden rounded-lg border border-[var(--board-border)] bg-[var(--board-surface-soft)] p-2 text-[var(--board-text)]",
        className,
      )}
      data-testid={`${zone?.id ?? resolvedLabel}-single-card-zone`}
      data-zone-id={zone?.id}
      data-zone-layout="single-card"
      data-card-id={entity?.id}
      data-card-states={entity?.states.join(" ")}
      data-count={entityCount}
      aria-label={`${resolvedLabel}, ${entityCount} ${entityCount === 1 ? "card" : "cards"}`}
    >
      {entity ? (
        <CardFace
          entity={entity}
          density={density}
          selected={entity.id === selectedId}
          onClick={onSelect}
        />
      ) : (
        <EmptyZone
          label={resolvedEmptyLabel}
          count={showCount ? entityCount.toString() : undefined}
        />
      )}
      {showCount && entityCount > 1 && (
        <span className="absolute bottom-1 right-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--game-accent)] px-1 text-[11px] font-black leading-none text-white">
          {entityCount}
        </span>
      )}
    </div>
  );
}
