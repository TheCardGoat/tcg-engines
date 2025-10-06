import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const auroraBriarRose: LorcanaCharacterCardDefinition = {
  id: "du8",

  name: "Aurora",
  title: "Briar Rose",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**DISTURBING BEAUTY** When you play this character, chosen character gets -2 {S} this turn.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "DISTURBING BEAUTY",
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
    "There was something strange about that voice. Too beautiful to be real . . .",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  illustrator: "Rosalia Radosti",
  number: 138,
  set: "TFC",
  rarity: "common",
};
