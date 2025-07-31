import {
  banishEffect,
  returnCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterTarget,
  chosenItemFromDiscardTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const getOut: LorcanaActionCardDefinition = {
  id: "vaq",
  name: "Get Out!",
  characteristics: ["action"],
  text: "Banish chosen character, then return an item card from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Banish chosen character, then return an item card from your discard to your hand.",
      effects: [
        banishEffect({
          targets: [chosenCharacterTarget],
          followedBy: returnCardEffect({
            to: "hand",
            from: "discard",
            targets: [chosenItemFromDiscardTarget],
          }),
        }),
      ],
    },
  ],
  inkwell: false,
  colors: ["ruby", "sapphire"],
  cost: 6,
  illustrator: "Diego Saito",
  number: 148,
  set: "008",
  rarity: "uncommon",
};
