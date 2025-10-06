import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulaPowerHungry: LorcanitoCharacterCardDefinition = {
  id: "z61",
  name: "Ursula",
  title: "Power Hungry",
  characteristics: ["sorcerer", "storyborn", "villain"],
  text: "**IT'S TOO EASY!** When you play this character, each opponent loses 1 lore. You may draw a card for each 1 lore lost this way.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "It's Too Easy",
      text: "Each opponent loses 1 lore. You may draw a card for each 1 lore lost this way.",
      effects: [
        {
          type: "draw",
          amount: 1,
          target: self,
        },
        {
          type: "lore",
          modifier: "subtract",
          amount: 1,
          target: opponent,
        },
      ],
    }),
  ],
  flavour:
    "The first Rule of Villainy: If you're going to be evil, you've got to have <b>style</b>.",
  colors: ["amethyst"],
  cost: 7,
  strength: 2,
  willpower: 8,
  lore: 3,
  illustrator: "Simangaliso Sibaya",
  number: 59,
  set: "TFC",
  rarity: "legendary",
};
