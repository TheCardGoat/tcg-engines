import { returnCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterFromDiscardTarget,
  chosenCharacterWithTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const onlySoMuchRoom: LorcanaActionCardDefinition = {
  id: "o94",
  name: "Only So Much Room",
  characteristics: ["action"],
  text: "Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.",
      effects: [
        returnCardEffect({
          targets: [
            chosenCharacterWithTarget({
              attribute: "strength",
              comparison: "lte",
              value: 2,
            }),
          ],
          to: "hand",
          from: "play",
        }),
        returnCardEffect({
          targets: [chosenCharacterFromDiscardTarget],
          to: "hand",
          from: "discard",
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amber", "emerald"],
  cost: 4,
  illustrator: "Therese Widenfjall",
  number: 41,
  set: "008",
  rarity: "common",
};
