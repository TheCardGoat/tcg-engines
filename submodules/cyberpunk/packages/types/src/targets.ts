import type { CardFace, CardTargetDSL, CardType, RelativePlayer } from "./index.ts";

function inPlayCards(
  controller: RelativePlayer,
  cardTypes: CardType[],
  face?: CardFace,
): CardTargetDSL {
  return {
    selector: "card",
    controller,
    zones: ["field", "legendArea"],
    cardTypes,
    ...(face === undefined ? {} : { face }),
  };
}

/** CR 4.2.1: a Legend on the field remains a Legend. Area-specific text uses an explicit zone. */
export function legendsInPlay(controller: RelativePlayer, face?: CardFace): CardTargetDSL {
  return inPlayCards(controller, ["legend"], face);
}

/** The resolver returns each card once, including a field Legend that is also a Unit. */
export function unitsAndLegendsInPlay(controller: RelativePlayer, face?: CardFace): CardTargetDSL {
  return inPlayCards(controller, ["unit", "legend"], face);
}
