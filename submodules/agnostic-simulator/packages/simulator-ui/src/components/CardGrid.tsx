import type { SimulatorEntity } from "@tcg/simulator-contract";
import { motion } from "motion/react";

import { cx } from "../class-names";
import { CardFace } from "./CardFace";
import { EmptyZone } from "./EmptyZone";

export interface CardGridProps {
  entities: SimulatorEntity[];
  emptyLabel?: string;
  countLabel?: string;
  density?: "compact" | "normal" | "large";
  compact?: boolean;
  ariaLabel?: string;
}

const CARD_GRID_MIN_HEIGHT_CLASS: Record<NonNullable<CardGridProps["density"]>, string> = {
  compact: "min-h-[134px]",
  normal: "min-h-[157px]",
  large: "min-h-[190px]",
};
const CARD_LAYOUT_TRANSITION = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1],
} as const;

export function CardGrid({
  entities,
  emptyLabel = "Empty zone",
  countLabel,
  density = "normal",
  compact = false,
  ariaLabel,
}: CardGridProps) {
  const cardDensity = compact ? "mini" : density;
  const gridClass = cx(
    "card-grid grid items-stretch gap-2 overflow-auto",
    compact ? "min-h-0" : CARD_GRID_MIN_HEIGHT_CLASS[density],
    density === "large"
      ? "grid-cols-[repeat(auto-fit,minmax(148px,1fr))]"
      : compact
        ? "grid-cols-[repeat(auto-fit,minmax(82px,max-content))]"
        : "grid-cols-[repeat(auto-fit,minmax(118px,1fr))]",
  );

  return (
    <div
      className={gridClass}
      data-card-density={density}
      role={ariaLabel ? "list" : undefined}
      aria-label={ariaLabel}
    >
      {entities.length > 0 ? (
        entities.map((entity, index) => (
          <motion.div
            key={entity.id}
            aria-label={ariaLabel ? entity.title : undefined}
            aria-posinset={ariaLabel ? index + 1 : undefined}
            aria-setsize={ariaLabel ? entities.length : undefined}
            data-card-id={entity.id}
            data-card-states={entity.states.join(" ")}
            className="min-w-0 justify-self-start"
            data-card-layout-id={entity.id}
            data-entity-id={entity.id}
            role={ariaLabel ? "listitem" : undefined}
            layout="position"
            transition={CARD_LAYOUT_TRANSITION}
          >
            <CardFace entity={entity} density={cardDensity} />
          </motion.div>
        ))
      ) : (
        <EmptyZone label={emptyLabel} count={countLabel} />
      )}
    </div>
  );
}
