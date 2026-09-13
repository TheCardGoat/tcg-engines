/**
 * Always-visible nested event log: move lines + indented effect lines.
 */

import { useEffect, useRef } from "react";

import type { LogLine } from "../projection/projectSimulator.ts";
import animations from "./animations.module.css";
import classes from "./board.module.css";

export interface LogPanelProps {
  readonly lines: readonly LogLine[];
}

export function LogPanel({ lines }: LogPanelProps) {
  const endRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines.length]);

  let lastTurn = 0;
  return (
    <div className={classes.logPanel} data-testid="naruto-log" aria-label="Game log">
      {lines.map((line) => {
        const showTurn = line.turn !== lastTurn;
        lastTurn = line.turn;
        return (
          <span key={line.id}>
            {showTurn ? <p className={classes.logTurn}>Turn {line.turn}</p> : null}
            <p
              className={`${classes.logLine} ${line.nested ? classes.logNested : ""} ${animations.logIn}`}
            >
              {line.text}
            </p>
          </span>
        );
      })}
      <p ref={endRef} aria-hidden />
    </div>
  );
}
