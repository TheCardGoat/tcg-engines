import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";

import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
export const rapunzelGiftedWithHealing: LorcanaCharacterCardDefinition = {
  id: "kro",
  name: "Rapunzel",
  title: "Gifted with Healing",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**GLEAM AND GLOW** When you play this character, remove up to 3 damage from one of your characters. Draw a card for each 1 damage removed this way.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      name: "GLEAM AND GLOW",
      text: "When you play this character, remove up to 3 damage from one of your characters. Draw a card for each 1 damage removed this way.",
      type: "resolution",
      effects: [
        {
          type: "heal",
          amount: 3,
          // THIS IS HACKY AS A TEMPORARY WORKAROUND. -1 REPRESENTS DYNAMIC HEAL BASED VALUE
          subEffect: {
            type: "draw",
            amount: -1,
            target: self,
          },
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  illustrator: "Jochem Van Gool",
  number: 18,
  set: "TFC",
  rarity: "legendary",
};
