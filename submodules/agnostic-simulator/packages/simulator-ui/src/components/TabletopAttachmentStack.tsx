import type { CSSProperties, ReactNode } from "react";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { SimulatorEntityVisual } from "../animation/components/SimulatorEntityVisual";
import classes from "./TabletopAttachmentStack.module.css";

export interface TabletopAttachmentStackProps {
  /** The host supplies public or hidden projections; this component does not infer relationships. */
  entity: SimulatorEntity;
  attachments: readonly SimulatorEntity[];
  expanded?: boolean;
  direction?: "below" | "right";
  offset?: number;
  width?: number;
  renderEntity?: (entity: SimulatorEntity) => ReactNode;
  onInspect?: (entity: SimulatorEntity) => void;
}

/** A layout-only attachment stack. Pairing, attachment limits, and legality stay with the game. */
export function TabletopAttachmentStack({
  entity,
  attachments,
  expanded = false,
  direction = "below",
  offset = 28,
  width = 140,
  renderEntity,
  onInspect,
}: TabletopAttachmentStackProps) {
  const step = expanded ? (direction === "below" ? width * 1.4 : width) + 16 : offset;
  const style: CSSProperties = {
    width: width + (direction === "right" ? attachments.length * step : 0),
    height: width * 1.4 + (direction === "below" ? attachments.length * step : 0),
  };
  const render = (card: SimulatorEntity) =>
    renderEntity?.(card) ?? <SimulatorEntityVisual entity={card} density="large" />;
  return (
    <div
      className={classes.stack}
      style={style}
      role="group"
      aria-label={`${entity.face === "hidden" ? "Hidden card" : entity.title}, ${attachments.length} attachments`}
    >
      {[...attachments].reverse().map((card, reverseIndex) => {
        const index = attachments.length - reverseIndex;
        return (
          <div
            key={card.id}
            className={classes.card}
            style={{
              width,
              zIndex: 1,
              transform: `translate3d(${direction === "right" ? index * step : 0}px, ${direction === "below" ? index * step : 0}px, 0)`,
            }}
          >
            {onInspect ? (
              <button
                type="button"
                aria-label={`Inspect ${card.face === "hidden" ? "hidden attachment" : card.title}`}
                onClick={() => onInspect(card)}
              >
                {render(card)}
              </button>
            ) : (
              render(card)
            )}
          </div>
        );
      })}
      <div className={classes.card} style={{ width, zIndex: 2 }}>
        {render(entity)}
      </div>
    </div>
  );
}
