import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";
import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverBanishesAnotherCharacterInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";

export const thebesTheBigOlive: LorcanaLocationCardDefinition = {
  id: "pph",
  name: "Thebes",
  title: "The Big Olive",
  characteristics: ["location"],
  text: "**IF YOU CAN MAKE IT HERE...** During your turn, whenever a character banishes another character in a challenge while here, you gain 2 lore.",
  type: "location",
  abilities: [
    gainAbilityWhileHere({
      name: "If You Can Make It Here...",
      text: "During your turn, whenever a character banishes another character in a challenge while here, you gain 2 lore.",
      conditions: [
        {
          type: "during-turn",
          value: "self",
        },
      ],
      ability: wheneverBanishesAnotherCharacterInChallenge({
        name: "If You Can Make It Here...",
        text: "During your turn, whenever a character banishes another character in a challenge while here, you gain 2 lore.",
        effects: [
          {
            type: "lore",
            amount: 2,
            modifier: "add",
            target: self,
          },
        ],
      }),
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  moveCost: 1,
  willpower: 7,
  illustrator: "Nicolas Ky",
  number: 204,
  set: "URR",
  rarity: "common",
};
