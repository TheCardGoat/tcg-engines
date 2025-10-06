import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lingImperialSoldier: LorcanitoCharacterCardDefinition = {
  id: "mp1",
  missingTestCase: true,
  name: "Ling",
  title: "Imperial Soldier",
  characteristics: ["storyborn", "ally"],
  text: "**FULL OF SPIRIT** Your Hero characters get +1 {S}.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "Full Of Spirit",
      text: "Your Hero characters get +1 {S}.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "add",
          target: {
            type: "card",
            value: "all",
            excludeSelf: true,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "characteristics", value: ["hero"] },
            ],
          },
        },
      ],
    },
  ],
  flavour: "A good friend is handy in a fight.",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Michela Cacciatore / Giulia Priori",
  number: 183,
  set: "URR",
  rarity: "uncommon",
};
