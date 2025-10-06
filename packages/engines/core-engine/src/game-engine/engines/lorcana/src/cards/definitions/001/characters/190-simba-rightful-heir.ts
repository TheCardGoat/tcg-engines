import { wheneverBanishesAnotherCharacterInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const simbaRightfulHeir: LorcanaCharacterCardDefinition = {
  id: "ac0",
  name: "Simba",
  title: "Rightful Heir",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**I KNOW WHAT I HAVE TO DO** During your turn, whenever this character banishes another character in a challenge, you gain 1 lore.",
  type: "character",
  abilities: [
    wheneverBanishesAnotherCharacterInChallenge({
      name: "I Know What I Have To Do",
      text: "During your turn, whenever this character banishes another character in a challenge, you gain 1 lore.",
      effects: [
        {
          type: "lore",
          amount: 1,
          modifier: "add",
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    }),
  ],
  flavour: "I can't hide anymore. It's time to accept my destiny.",
  colors: ["steel"],
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  illustrator: "Cookie",
  number: 190,
  set: "TFC",
  rarity: "uncommon",
};
