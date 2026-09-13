/** Chakra cards keep their actual artwork; spent or concealed cards show the common back. */

import type { PlayerId } from "@tcg-engines/naruto-engine";

import { CARD_BACK_URL, cardImageUrl } from "../projection/labels.ts";
import type { ChakraView, SummonView } from "../projection/projectSimulator.ts";
import board from "./board.module.css";
import classes from "./cards.module.css";
import { NarutoCardImage } from "./NarutoCardImage.tsx";
import { SummonSlot } from "./SummonSlot.tsx";
import type { BoardKit } from "./types.ts";

export interface ChakraPipsProps {
  readonly chakra: readonly ChakraView[];
  readonly owner: PlayerId;
  readonly summon?: SummonView;
  readonly kit: BoardKit;
}

export function ChakraPips({ chakra, owner, summon, kit }: ChakraPipsProps) {
  const faceUp = chakra.filter((c) => c.faceUp).length;
  return (
    <div
      className={board.chakraRow}
      data-testid={`naruto-chakra-${owner}`}
      data-face-up={faceUp}
      aria-label={`${faceUp} of ${chakra.length} Chakra cards face up`}
      role="img"
    >
      {chakra.map((pip) => (
        <span
          key={pip.uid}
          className={`${classes.chakraPip} ${pip.faceUp ? "" : classes.chakraSpent}`}
          data-card-id={pip.visible ? pip.cardId : undefined}
        >
          <span className={classes.chakraInner}>
            <span className={`${classes.chakraFace} ${classes.chakraFront}`}>
              <NarutoCardImage
                src={
                  pip.faceUp && pip.visible && pip.cardId ? cardImageUrl(pip.cardId) : CARD_BACK_URL
                }
                alt=""
                draggable={false}
                fallbackLabel={pip.faceUp && pip.visible ? "Chakra" : "Card back"}
              />
            </span>
            <span className={`${classes.chakraFace} ${classes.chakraBack}`}>
              <NarutoCardImage
                src={CARD_BACK_URL}
                alt=""
                draggable={false}
                fallbackLabel="Card back"
              />
            </span>
          </span>
        </span>
      ))}
      {summon ? <SummonSlot summon={summon} owner={owner} kit={kit} /> : null}
    </div>
  );
}
