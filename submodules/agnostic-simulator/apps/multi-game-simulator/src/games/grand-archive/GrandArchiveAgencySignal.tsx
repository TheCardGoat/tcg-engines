import { AnimatePresence, motion } from "motion/react";

interface GrandArchiveAgencySignalProps {
  readonly active: boolean;
  readonly side: "top" | "bottom";
  readonly statusLabel: string;
}

/** Marks the table edge belonging to the player who must supply the next input. */
export function GrandArchiveAgencySignal({
  active,
  side,
  statusLabel,
}: GrandArchiveAgencySignalProps) {
  return (
    <AnimatePresence initial={false}>
      {active ? (
        <motion.div
          key="agency-signal"
          className="ga-agency-signal"
          data-side={side}
          role="status"
          aria-label={statusLabel}
          initial={{ opacity: 0, transform: "translate3d(-50%, 0, 0) scaleX(0.72)" }}
          animate={{ opacity: 1, transform: "translate3d(-50%, 0, 0) scaleX(1)" }}
          exit={{ opacity: 0, transform: "translate3d(-50%, 0, 0) scaleX(0.86)" }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="ga-agency-signal__pointer" aria-hidden="true" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
