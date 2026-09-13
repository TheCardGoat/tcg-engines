import { AnimatePresence, motion } from "motion/react";

export function FabPrioritySignal({
  active,
  side,
  color,
  showPointer = false,
}: {
  readonly active: boolean;
  readonly side: "top" | "bottom";
  readonly color?: string;
  readonly showPointer?: boolean;
}) {
  return (
    <AnimatePresence initial={false}>
      {active ? (
        <motion.span
          key="priority-signal"
          aria-hidden="true"
          className="fab-priority-signal"
          data-side={side}
          initial={{ opacity: 0, transform: "translate3d(-50%, 0, 0) scaleX(0.72)" }}
          animate={{ opacity: 1, transform: "translate3d(-50%, 0, 0) scaleX(1)" }}
          exit={{ opacity: 0, transform: "translate3d(-50%, 0, 0) scaleX(0.86)" }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ color }}
        >
          {showPointer ? <span className="fab-priority-signal__pointer" /> : null}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}
