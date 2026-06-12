import type { CharacterCard } from "@tcg/lorcana-types";
import { faZhouHonorableWarriorI18n } from "./110-fa-zhou-honorable-warrior.i18n";

export const faZhouHonorableWarrior: CharacterCard = {
  id: "nta",
  canonicalId: "ci_nta",
  reprints: ["set11-110"],
  cardType: "character",
  name: "Fa Zhou",
  version: "Honorable Warrior",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "011",
  cardNumber: 110,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e10790e2f76f46f4aeb38d35164934b1",
    tcgPlayer: 676211,
  },
  text: [
    {
      title: "BATTLE WOUND",
      description: "This character enters play with 2 damage.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    {
      id: "12j-1",
      effect: {
        amount: 2,
        type: "enters-with-damage",
      },
      type: "static",
      name: "BATTLE WOUND",
      text: "BATTLE WOUND This character enters play with 2 damage.",
    },
  ],
  i18n: faZhouHonorableWarriorI18n,
};
