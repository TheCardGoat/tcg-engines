import type { ReactNode } from "react";
import { DropTargetFrame } from "@tcg/simulator-ui";
import { Link2Icon } from "lucide-react";

import { cn } from "../../../lib/utils.ts";
import styles from "./AttackDropCue.module.css";

interface AttackDropCueProps {
  readonly variant: "unit" | "player" | "pilot";
  readonly isOver: boolean;
  /** A Pilot dropped here satisfies this Unit's printed Link Condition. */
  readonly linkEligible?: boolean;
  readonly label: ReactNode;
  readonly detail?: ReactNode;
  readonly testId?: string;
}

export function AttackDropCue({
  variant,
  isOver,
  linkEligible = false,
  label,
  detail,
  testId,
}: AttackDropCueProps) {
  if (variant === "pilot") {
    return (
      <DropTargetFrame
        theme={
          linkEligible
            ? { accent: "#65d9a8", surface: "#063a2a" }
            : { accent: "#8daeff", surface: "#122657" }
        }
        label={linkEligible ? "Link" : "Pair"}
        indicator={
          linkEligible ? (
            <Link2Icon aria-hidden size={10} strokeWidth={2.75} data-testid="link-drop-icon" />
          ) : undefined
        }
        activeLabel="Release"
        isOver={isOver}
        testId={testId}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(styles.target, styles[variant], isOver && styles.over)}
      data-testid={testId}
    >
      <span className={styles.cue}>
        <span className={styles.cueRail} />
        <span className={styles.eyebrow}>
          {isOver ? "Target locked" : variant === "player" ? "Player target" : "Unit target"}
        </span>
        <strong className={styles.label}>{isOver ? "Release to attack" : label}</strong>
        {detail ? <span className={styles.detail}>{detail}</span> : null}
      </span>
    </span>
  );
}
