import { wheneverOneOfYourCharChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";

export const madHatterUnrulyEccentric: LorcanitoCharacterCard = {
  id: "fdh",
  name: "Mad Hatter",
  title: "Unruly Eccentric",
  characteristics: ["storyborn"],
  text: "UNBIRTHDAY PRESENT Whenever a damaged character challenges another character, you may draw a card.",
  type: "character",
  abilities: [
    wheneverOneOfYourCharChallengesAnotherChar({
      name: "UNBIRTHDAY PRESENT",
      text: "Whenever a damaged character challenges another character, you may draw a card.",
      effects: [drawACard],
      optional: true,
      attackerFilter: [
        {
          filter: "status",
          value: "damage",
          comparison: { operator: "gt", value: 0 },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald", "ruby"],
  cost: 6,
  strength: 3,
  willpower: 5,
  illustrator: "John Loren / Nicholas Kole",
  number: 94,
  set: "007",
  rarity: "rare",
  lore: 2,
};
