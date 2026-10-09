import { handFanLayout } from "../hand-fan";
import { cardRowSlot } from "../zones";
import { cardSelection } from "../card-selection";
import type { OpeningBeat } from "./types";
import type { CardTransferRect } from "../motion";

export interface OpeningPose extends CardTransferRect {
  rotation: number;
  face: boolean;
}
export function openingLayout(width: number, height: number, count: number) {
  const compact = width < 700;
  const reviewWidth = Math.min(138, (width - (compact ? 36 : 200)) / (compact ? 4.5 : count + 0.4));
  const smallWidth = Math.min(80, width * 0.115, height * 0.12);
  const rect = (x: number, y: number, w: number, face = false, rotation = 0): OpeningPose => ({
    left: x - w / 2,
    top: y - (w * 1.4) / 2,
    width: w,
    height: w * 1.4,
    face,
    rotation,
  });
  const deck = (rival: boolean) =>
    rect(
      width - smallWidth * 0.85 - 12,
      height * (rival ? (compact ? 0.085 : 0.2) : 0.8),
      smallWidth,
    );
  const auxiliary = (rival: boolean) =>
    rect(
      smallWidth * (compact ? 1.7 : 2.1) + (compact ? 12 : 20),
      height * (rival ? (compact ? 0.085 : 0.22) : 0.8),
      smallWidth * 0.72,
    );
  const leader = (rival: boolean, mode: OpeningBeat["leaders"]) =>
    mode === "showcase"
      ? rect(
          width * (rival ? 0.65 : 0.35),
          height * 0.48,
          Math.min(185, width * 0.25, height * 0.32),
          true,
        )
      : rect(
          smallWidth * 0.85 + 12,
          height * (rival ? (compact ? 0.085 : 0.26) : compact ? 0.8 : 0.71),
          smallWidth,
          mode === "field",
        );
  const card = (
    index: number,
    rival: boolean,
    beat: OpeningBeat,
    selected: boolean,
    inspected: number | null = null,
  ): OpeningPose => {
    const dealt = index < (rival ? beat.rivalCount : beat.localCount);
    if (!dealt || (!rival && beat.hand === "return" && selected)) return deck(rival);
    if (rival)
      return rect(
        width / 2 + (index - (count - 1) / 2) * smallWidth * 0.42,
        34,
        smallWidth * 0.76,
        false,
        (index - (count - 1) / 2) * -0.025,
      );
    if (beat.hand === "table")
      return handFanLayout(width, height, count).pose(index, inspected === index);
    const columns = compact ? Math.ceil(count / 2) : count;
    const slot = cardRowSlot(index, count, reviewWidth + 7, columns, reviewWidth * 1.4 + 25);
    const x = width / 2 + slot.x;
    const y = height * (compact ? 0.4 : 0.48) + slot.y;
    const highlighted = selected && beat.action === "hand";
    return rect(
      x,
      y - (highlighted ? cardSelection.lift : 0),
      reviewWidth * (highlighted ? cardSelection.scale : 1),
      true,
    );
  };
  return { deck, auxiliary, leader, card, smallWidth };
}

/** Stable slot identity: replace only selected cards after their return flight ends. */
export function openingCardIndex(
  slot: number,
  selected: readonly number[],
  replaced: boolean,
  count: number,
  poolSize: number,
) {
  return replaced && selected.includes(slot)
    ? (count + selected.indexOf(slot)) % poolSize
    : slot % poolSize;
}
