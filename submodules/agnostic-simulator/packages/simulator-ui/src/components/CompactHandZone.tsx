import type { SimulatorEntity } from "@tcg/simulator-contract";

import { CardFace } from "./CardFace";

export interface CompactHandZoneProps {
  entities: SimulatorEntity[];
  selectedId?: string;
  ariaLabel?: string;
  onSelect?: (entity: SimulatorEntity) => void;
  onPlay?: (entity: SimulatorEntity) => void;
}

const COMPACT_CARD_WIDTH = 60;
const COMPACT_CARD_SCALE = 0.88;

export function CompactHandZone({
  entities,
  selectedId,
  ariaLabel = "Hand zone",
  onSelect,
  onPlay,
}: CompactHandZoneProps) {
  const cardStep = computeCardStep(entities.length);
  const spreadWidth =
    entities.length <= 1
      ? COMPACT_CARD_WIDTH
      : COMPACT_CARD_WIDTH + (entities.length - 1) * cardStep;
  const stageWidth = Math.max(240, spreadWidth + 40);

  return (
    <div
      className="compact-hand-zone min-h-0 min-w-0 overflow-x-auto overflow-y-hidden"
      role="list"
      aria-label={ariaLabel}
    >
      <div className="relative h-full min-h-[76px]" style={{ minWidth: stageWidth }}>
        {entities.map((entity, index) => {
          const selected = entity.id === selectedId;
          const offsetX = computeOffsetX(index, entities.length, cardStep);
          const angle = computeAngle(index, entities.length);
          return (
            <div
              key={entity.id}
              className="compact-hand-card absolute bottom-0 transition-transform duration-200 ease-out will-change-transform"
              data-card-id={entity.id}
              data-card-states={entity.states.join(" ")}
              data-entity-id={entity.id}
              style={{
                left: "50%",
                transform: `translateX(${offsetX - COMPACT_CARD_WIDTH / 2}px) translateY(${selected ? -6 : 0}px) rotate(${angle}deg) scale(${COMPACT_CARD_SCALE})`,
                transformOrigin: "center 116%",
                zIndex: computeZIndex(index, entities.length, selected),
              }}
              role="listitem"
            >
              <CardFace
                entity={entity}
                density="mini"
                selected={selected}
                draggable
                tabIndex={0}
                onClick={() => onSelect?.(entity)}
                onDblClick={() => onPlay?.(entity)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function computeAngle(index: number, total: number): number {
  if (total <= 1) return 0;
  const maxAngle = Math.min(22, total * 3.5);
  const step = maxAngle / Math.max(1, total - 1);
  return (index - (total - 1) / 2) * step;
}

function computeCardStep(total: number): number {
  if (total <= 1) return 0;
  return Math.max(34, Math.min(44, 360 / Math.max(1, total - 1)));
}

function computeOffsetX(index: number, total: number, cardStep: number): number {
  if (total <= 1) return 0;
  return (index - (total - 1) / 2) * cardStep;
}

function computeZIndex(index: number, total: number, selected: boolean): number {
  const centerDistance = Math.abs(index - (total - 1) / 2);
  const base = Math.round(100 - centerDistance * 8);
  return selected ? base + 200 : base;
}
