import { youPayXLessToPlayNextCharThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const zeroToHero: LorcanaActionCardDefinition = {
  id: "uyt",

  name: "Zero To Hero",
  characteristics: ["action", "song"],
  text: "_A character with cost 2 or more can {E} to sing this song for free.)_\n\nCount the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      optional: false,
      effects: [
        youPayXLessToPlayNextCharThisTurn({
          dynamic: true,
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
          ],
        }),
      ],
    },
  ],
  colors: ["amber"],
  cost: 2,
  illustrator: "Rob Di Salvo",
  number: 32,
  set: "ROF",
  rarity: "uncommon",
};
