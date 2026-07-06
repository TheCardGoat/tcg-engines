import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { CardFace } from "./CardFace";
import { EmptyZone } from "./EmptyZone";

export interface CardStackProps {
  zone: SimulatorZone | undefined;
  entities: SimulatorEntity[];
  entityCount: number;
  label?: string;
  emptyLabel?: string;
  selectedId?: string;
  density?: "mini" | "compact";
  className?: string;
  onSelect?: (entity: SimulatorEntity) => void;
}

export function CardStack({
  zone,
  entities,
  entityCount,
  label,
  emptyLabel,
  selectedId,
  density = "mini",
  className,
  onSelect,
}: CardStackProps) {
  const topEntity = entities[0];
  const stackLabel = label ?? zone?.label ?? "Stack";
  const resolvedEmptyLabel = emptyLabel ?? stackLabel;

  return (
    <div
      className={cx(
        "card-stack relative grid min-h-[106px] w-[70px] p-0 text-[var(--board-text)]",
        className,
      )}
      data-testid={`${zone?.id ?? stackLabel}-stack`}
      data-zone-id={zone?.id}
      data-sim-zone-id={zone?.id}
      data-zone-layout="stack"
      data-count={entityCount}
      aria-label={`${stackLabel}, ${entityCount} cards`}
    >
      {entityCount > 0 && topEntity ? (
        <>
          <span
            className="card-stack-layers absolute inset-[5px_-5px_-5px_5px] rounded-[7px] border border-white/25 bg-slate-950/20"
            aria-hidden="true"
          />
          <CardFace
            entity={topEntity}
            density={density}
            selected={topEntity.id === selectedId}
            onClick={onSelect}
          />
        </>
      ) : (
        <EmptyZone label={resolvedEmptyLabel} count={entityCount.toString()} />
      )}
      <span className="card-stack-count absolute bottom-[17px] right-[-8px] grid h-6 min-w-7 place-items-center rounded-[7px] border border-white/30 bg-black/70 px-1 text-[15px] font-black leading-none text-white">
        {entityCount}
      </span>
      <span className="card-stack-label absolute bottom-[-6px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-extrabold uppercase text-[var(--board-muted)]">
        {stackLabel}
      </span>
    </div>
  );
}
