import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sneezyVeryAllergic: LorcanaCharacterCardDefinition = {
  id: "aux",
  name: "Sneezy",
  title: "Very Allergic",
  characteristics: ["storyborn", "ally", "seven dwarfs"],
  text: "**AH-CHOO!** Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.",
  type: "character",
  abilities: [
    wheneverPlays({
      name: "AH-CHOO!",
      text: "Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.",
      optional: true,
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
          {
            filter: "characteristics",
            value: ["seven dwarfs"],
          },
        ],
      },
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "subtract",
          target: chosenCharacter,
        },
      ],
    }),
  ],
  flavour: "Look out! He's gonna blow!",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Kendall Hale",
  number: 22,
  set: "ROF",
  rarity: "common",
};
