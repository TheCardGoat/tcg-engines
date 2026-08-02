/**
 * Chakra pips: 3D CSS flip; face-down (spent) pips show the chakra back.
 */

import type { ChakraView } from "../projection/projectSimulator.ts";
import board from "./board.module.css";
import classes from "./cards.module.css";

export interface ChakraPipsProps {
  readonly chakra: readonly ChakraView[];
  readonly owner: string;
}

export function ChakraPips({ chakra, owner }: ChakraPipsProps) {
  const faceUp = chakra.filter((c) => c.faceUp).length;
  return (
    <div
      className={board.chakraRow}
      data-testid={`naruto-chakra-${owner}`}
      data-face-up={faceUp}
      aria-label={`${faceUp} of ${chakra.length} chakra face up`}
      role="img"
    >
      {chakra.map((pip) => (
        <span
          key={pip.uid}
          className={`${classes.chakraPip} ${pip.faceUp ? "" : classes.chakraSpent}`}
        >
          <span className={classes.chakraInner}>
            <span className={`${classes.chakraFace} ${classes.chakraFront}`}>
              <span>C</span>
            </span>
            <span className={`${classes.chakraFace} ${classes.chakraBack}`}>spent</span>
          </span>
        </span>
      ))}
    </div>
  );
}
