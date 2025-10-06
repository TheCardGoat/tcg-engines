import { drawACard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenYouPlayThisCharAbility } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gadgetHackwrenchQuirkyScientist: LorcanaCharacterCardDefinition = {
  id: "i8y",
  name: "Gadget Hackwrench",
  title: "Quirky Scientist",
  characteristics: ["storyborn", "ally", "inventor"],
  text: "GOLLY! When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "GOLLY!",
      text: "When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
      optional: true,
      resolutionConditions: [
        {
          type: "filter",
          filters: [
            { filter: "owner", value: "opponent" },
            { filter: "zone", value: "hand" },
          ],
          comparison: {
            operator: "gt",
            value: {
              dynamic: true,
              filters: [
                { filter: "owner", value: "self" },
                { filter: "zone", value: "hand" },
              ],
            },
          },
        },
      ],
      effects: [drawACard],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 3,
  willpower: 2,
  illustrator: "Lisanne Koetsier",
  number: 99,
  set: "008",
  rarity: "rare",
  lore: 2,
};
