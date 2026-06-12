import type { ReactNode } from "react";
import type { SimulatorEntity } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { CardFace } from "./CardFace";

export interface CardFanProps {
  entities: SimulatorEntity[];
  density?: "compact" | "normal";
  selectedId?: string;
  orientation?: "portrait" | "landscape";
  ariaLabel?: string;
  onSelect?: (entity: SimulatorEntity) => void;
  onPlay?: (entity: SimulatorEntity) => void;
  renderCard?: (entity: SimulatorEntity, state: CardFanItemState) => ReactNode;
}

export interface CardFanItemState {
  index: number;
  total: number;
  selected: boolean;
  density: "compact" | "normal";
  mobile: boolean;
}

const CARD_WIDTH: Record<CardFanProps["density"] & string, number> = {
  compact: 138,
  normal: 156,
};

const CARD_HEIGHT: Record<CardFanProps["density"] & string, number> = {
  compact: 118,
  normal: 138,
};

export function CardFan({
  entities,
  density = "compact",
  selectedId,
  orientation = "portrait",
  ariaLabel = "Card fan",
  onSelect,
  onPlay,
  renderCard,
}: CardFanProps) {
  const cardW = CARD_WIDTH[density];
  const cardH = CARD_HEIGHT[density];
  const isLandscape = orientation === "landscape";
  const fanContainerHeight = isLandscape ? cardW * 0.9 : cardH * 1.35;

  return (
    <>
      <div
        className={cx(
          "card-fan-desktop relative hidden min-w-0 items-end justify-center md:flex",
          isLandscape && "items-center",
        )}
        style={{ height: fanContainerHeight }}
        role="list"
        aria-label={ariaLabel}
      >
        {entities.map((entity, i) => {
          const angle = computeFanAngle(i, entities.length);
          const offsetX = computeOffsetX(i, entities.length, cardW);
          const zIndex = computeZIndex(i, entities.length, selectedId, entities);
          const isSelected = entity.id === selectedId;
          return (
            <div
              key={entity.id}
              className={cx(
                "card-fan-item absolute transition-transform duration-200 ease-out will-change-transform",
                isSelected && "-translate-y-3",
              )}
              style={{
                transform: `rotate(${angle}deg) translateX(${offsetX}px)${isSelected ? " translateY(-12px)" : ""}`,
                transformOrigin: "center 130%",
                zIndex,
                width: cardW,
              }}
              role="listitem"
            >
              {renderCard ? (
                renderCard(entity, {
                  index: i,
                  total: entities.length,
                  selected: isSelected,
                  density,
                  mobile: false,
                })
              ) : (
                <CardFace
                  entity={entity}
                  density={density}
                  selected={isSelected}
                  draggable
                  tabIndex={0}
                  onClick={() => onSelect?.(entity)}
                  onDblClick={() => onPlay?.(entity)}
                />
              )}
            </div>
          );
        })}
      </div>

      <div
        className="card-fan-mobile flex min-w-0 overflow-x-auto pb-2 pt-1 md:hidden"
        style={{
          minHeight: cardH,
          scrollSnapType: "x mandatory",
          overscrollBehaviorInline: "contain",
        }}
        role="list"
        aria-label={ariaLabel}
      >
        {entities.map((entity, i) => {
          const isSelected = entity.id === selectedId;
          return (
            <div
              key={entity.id}
              className={cx(
                "card-fan-mobile-item flex-shrink-0 scroll-mx-2 snap-center transition-transform duration-200",
                i !== 0 && "-ml-3",
                isSelected && "-translate-y-2",
              )}
              style={{ width: cardW * 0.9 }}
              role="listitem"
            >
              {renderCard ? (
                renderCard(entity, {
                  index: i,
                  total: entities.length,
                  selected: isSelected,
                  density,
                  mobile: true,
                })
              ) : (
                <CardFace
                  entity={entity}
                  density="compact"
                  selected={isSelected}
                  draggable
                  onClick={() => onSelect?.(entity)}
                  onDblClick={() => onPlay?.(entity)}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function computeFanAngle(index: number, total: number): number {
  if (total <= 1) return 0;
  const maxAngle = Math.min(60, total * 5.5);
  const step = maxAngle / Math.max(1, total - 1);
  return (index - (total - 1) / 2) * step;
}

function computeOverlapFactor(total: number): number {
  if (total <= 3) return 0.78;
  if (total <= 6) return 0.65;
  if (total <= 10) return 0.5;
  if (total <= 15) return 0.38;
  return 0.28;
}

function computeOffsetX(index: number, total: number, cardW: number): number {
  if (total <= 1) return 0;
  const overlap = computeOverlapFactor(total);
  const step = cardW * overlap;
  return (index - (total - 1) / 2) * step;
}

function computeZIndex(
  index: number,
  total: number,
  selectedId: string | undefined,
  entities: SimulatorEntity[],
): number {
  const base = total <= 1 ? 0 : Math.round(100 - Math.abs(index - (total - 1) / 2) * 10);
  if (selectedId && entities[index]?.id === selectedId) return base + 200;
  return base;
}
