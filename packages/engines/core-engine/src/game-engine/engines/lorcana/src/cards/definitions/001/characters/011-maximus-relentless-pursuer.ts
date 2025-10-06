import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maximusRentlessPersuer: LorcanaCharacterCardDefinition = {
  id: "ak8",

  name: "Maximus",
  title: "Relentless Pursuer",
  characteristics: ["dreamborn", "ally"],
  text: "**HORSE KICK** When you play this character, chosen character gets -2 {S} this turn.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "HORSE KICK",
      text: "When you play this character, chosen character gets -2 {S} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "subtract",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    }),
  ],
  flavour:
    "He pursues his quarry with courage, discipline, \rand a touch of class.",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Kendall Hale",
  number: 11,
  set: "TFC",
  rarity: "uncommon",
};
