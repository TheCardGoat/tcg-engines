import type { MoveOptionSelectableCost } from "@tcg/lorcana-engine";

export function getChooseCostStatusMessage(
  sourceCardLabel: string,
  selectableCost: MoveOptionSelectableCost,
): string {
  const noun =
    selectableCost.kind === "banishCharacters" || selectableCost.kind === "exertCharacters"
      ? "character"
      : "item";
  const countPrefix =
    selectableCost.count === 1 ? (noun === "item" ? "an" : "a") : `${selectableCost.count}`;
  const qualifier = selectableCost.cardName
    ? ` named ${selectableCost.cardName}`
    : selectableCost.classification
      ? ` with ${selectableCost.classification}`
      : selectableCost.cardType && selectableCost.cardType !== noun
        ? ` ${selectableCost.cardType}`
        : "";

  if (selectableCost.kind === "revealCards")
    return `Choose ${selectableCost.count} cards${selectableCost.candidateGroups ? " with the same name" : ""} from your hand to reveal for ${sourceCardLabel}.`;
  if (selectableCost.kind === "discardCards") {
    return `Choose ${selectableCost.count === 1 ? "a" : selectableCost.count} card${selectableCost.count === 1 ? "" : "s"}${qualifier} to discard for ${sourceCardLabel}.`;
  }

  if (selectableCost.kind === "exertCharacters" || selectableCost.kind === "exertItems") {
    return `Choose ${countPrefix} ${selectableCost.kind === "exertCharacters" ? "character" : "item"}${selectableCost.count === 1 ? "" : "s"}${qualifier} to exert for ${sourceCardLabel}.`;
  }

  if (selectableCost.kind === "putOnDeckBottom") {
    const costNoun =
      selectableCost.classification ??
      (selectableCost.cardType ? `${selectableCost.cardType} card` : "card");
    return `Choose ${selectableCost.count === 1 ? (/^[aeiou]/i.test(costNoun) ? "an" : "a") : selectableCost.count} ${costNoun}${selectableCost.count === 1 ? "" : "s"} from your discard to put on bottom of your deck to play ${sourceCardLabel} for free.`;
  }

  return `Choose ${countPrefix} ${selectableCost.kind === "banishCharacters" ? "character" : "item"}${selectableCost.count === 1 ? "" : "s"}${qualifier} to banish for ${sourceCardLabel}.`;
}
