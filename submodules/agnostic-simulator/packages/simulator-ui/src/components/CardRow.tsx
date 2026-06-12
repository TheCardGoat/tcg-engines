import type { SimulatorEntity } from "@tcg/simulator-contract";
import { motion } from "motion/react";

import { cx } from "../class-names";
import { CardFace } from "./CardFace";
import { EmptyZone } from "./EmptyZone";

export interface CardRowProps {
  entities: SimulatorEntity[];
  emptyLabel?: string;
  density?: "compact" | "normal" | "large";
  wrap?: boolean;
}

const CARD_LAYOUT_TRANSITION = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1],
} as const;

export function CardRow({
  entities,
  emptyLabel = "No cards",
  density = "compact",
  wrap = true,
}: CardRowProps) {
  const rowClass = cx(
    "card-row mt-2 flex min-w-0 items-stretch gap-2 [overscroll-behavior-inline:contain]",
    wrap ? "flex-wrap overflow-x-visible" : "overflow-x-auto",
  );

  return (
    <div className={rowClass} data-card-density={density} data-card-wrap={wrap}>
      {entities.length > 0 ? (
        entities.map((entity) => (
          <motion.div
            key={entity.id}
            className="min-w-0 flex-shrink-0"
            data-card-layout-id={entity.id}
            layout="position"
            transition={CARD_LAYOUT_TRANSITION}
          >
            <CardFace entity={entity} density={density} />
          </motion.div>
        ))
      ) : (
        <EmptyZone label={emptyLabel} />
      )}
    </div>
  );
}
