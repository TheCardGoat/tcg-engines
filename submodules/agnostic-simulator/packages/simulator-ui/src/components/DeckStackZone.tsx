import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { CardFace } from "./CardFace";
import { EmptyZone } from "./EmptyZone";

export interface DeckStackZoneProps {
  zone: SimulatorZone | undefined;
  entities: SimulatorEntity[];
  entityCount: number;
  label?: string;
  emptyLabel?: string;
  density?: "mini" | "compact";
  selectedId?: string;
  className?: string;
  onSelect?: (entity: SimulatorEntity) => void;
}

export function DeckStackZone({
  zone,
  entities,
  entityCount,
  label,
  emptyLabel,
  density = "mini",
  selectedId,
  className,
  onSelect,
}: DeckStackZoneProps) {
  const sourceEntity = entities[0];
  const resolvedLabel = label ?? zone?.label ?? "Deck";
  const resolvedEmptyLabel = emptyLabel ?? resolvedLabel;
  const topEntity =
    entityCount > 0 ? toFacedownEntity(sourceEntity, zone, resolvedLabel) : undefined;

  return (
    <div
      className={cx(
        "deck-stack-zone relative grid min-h-[118px] w-[78px] content-start justify-items-center overflow-hidden rounded-lg border border-[var(--board-border)] bg-[var(--board-surface-soft)] px-[9px] pb-[18px] pt-1 text-[var(--board-text)]",
        className,
      )}
      data-testid={`${zone?.id ?? resolvedLabel}-stack`}
      data-zone-id={zone?.id}
      data-sim-zone-id={zone?.id}
      data-zone-layout="deck-stack"
      data-count={entityCount}
      aria-label={`${resolvedLabel}, ${entityCount} ${entityCount === 1 ? "card" : "cards"}`}
    >
      {topEntity ? (
        <>
          <span
            className="deck-stack-zone-layers pointer-events-none absolute inset-[8px_8px_23px_13px] rounded-md border border-white/25 bg-slate-950/20"
            aria-hidden="true"
          />
          <CardFace
            entity={topEntity}
            density={density}
            selected={sourceEntity?.id === selectedId}
            onClick={sourceEntity ? onSelect : undefined}
          />
        </>
      ) : (
        <EmptyZone label={resolvedEmptyLabel} count="0" />
      )}
      <StackCount value={entityCount} />
      <StackLabel label={resolvedLabel} />
    </div>
  );
}

function toFacedownEntity(
  entity: SimulatorEntity | undefined,
  zone: SimulatorZone | undefined,
  label: string,
): SimulatorEntity {
  return {
    id: entity?.id ?? `${zone?.id ?? label}-facedown-top`,
    title: "Hidden card",
    subtitle: "Private information",
    kind: "card",
    ownerId: entity?.ownerId ?? zone?.ownerId ?? "unknown",
    face: "hidden",
    states: ["hidden"],
    stats: [],
    traits: [],
    backImageUrl: entity?.backImageUrl,
  };
}

function StackCount({ value }: { value: number }) {
  return (
    <span className="tabletop-pile-count absolute bottom-[27px] right-1 grid h-[22px] min-w-[26px] place-items-center rounded-[7px] border border-white/30 bg-black/70 px-1 text-[13px] font-black leading-none text-white">
      {value}
    </span>
  );
}

function StackLabel({ label }: { label: string }) {
  return (
    <span className="tabletop-pile-label absolute bottom-[3px] left-1/2 max-w-[calc(100%-10px)] -translate-x-1/2 overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-extrabold uppercase text-[var(--board-muted)]">
      {label}
    </span>
  );
}
