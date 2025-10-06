import { returnThisCardToHand } from "~/game-engine/engines/lorcana/src/abilities/effect";

import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/target";
import { whenYouPlayThis } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theMagicFeather: LorcanaItemCardDefinition = {
  id: "cxi",
  // notImplemented: true,
  missingTestCase: false,
  name: "The Magic Feather",
  characteristics: ["item"],
  text: "NOW YOU CAN FLY! When you play this item, choose a character of yours. While this item is in play, that character gains Evasive.\nGROUNDED 3 {I} – Return this item to your hand.",
  type: "item",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Mariana Moreno",
  number: 64,
  set: "009",
  rarity: "rare",
  abilities: [
    whenYouPlayThis({
      name: "NOW YOU CAN FLY!",
      text: "When you play this item, choose a character of yours. While this item is in play, that character gains Evasive.",
      effects: [
        {
          type: "ability",
          ability: "evasive",
          duration: "while_in_play",
          modifier: "add",
          target: chosenCharacter,
        },
      ],
    }),
    {
      type: "activated",
      costs: [{ type: "ink", amount: 3 }],
      name: "GROUNDED",
      text: "3 {I} – Return this item to your hand.",
      effects: [returnThisCardToHand],
    },
  ],
};
