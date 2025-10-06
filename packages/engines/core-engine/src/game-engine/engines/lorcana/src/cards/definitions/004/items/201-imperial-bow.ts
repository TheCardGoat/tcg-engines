import { chosenHeroCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const imperialBow: LorcanaItemCardDefinition = {
  id: "mcd",
  missingTestCase: true,
  name: "Imperial Bow",
  characteristics: ["item"],
  text: "**WITHIN RANGE** {E}, 1 {I} − Chosen Hero character gains **Challenger** +2 and **Evasive** this turn. _(They get +2 {S} while challenging. They can challenge characters with Evasive.)_",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Within Range",
      text: "{E}, 1 {I} − Chosen Hero character gains **Challenger** +2 and **Evasive** this turn. _(They get +2 {S} while challenging. They can challenge characters with Evasive.)_",
      costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
      effects: [
        {
          type: "ability",
          ability: "challenger",
          amount: 2,
          modifier: "add",
          duration: "turn",
          target: chosenHeroCharacter,
        },
        {
          type: "ability",
          ability: "evasive",
          modifier: "add",
          duration: "turn",
          target: chosenHeroCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Yari Lute",
  number: 201,
  set: "URR",
  rarity: "uncommon",
};
