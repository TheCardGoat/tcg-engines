import type { CharacterCard } from "@tcg/lorcana-types";
import { painUnderworldImpI18n } from "./086-pain-underworld-imp.i18n";

export const painUnderworldImp: CharacterCard = {
  id: "qfi",
  canonicalId: "ci_qfi",
  reprints: ["set2-086"],
  cardType: "character",
  name: "Pain",
  version: "Underworld Imp",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "002",
  cardNumber: 86,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_756eca11fdec48c2bc3b4f427b151b6e",
    tcgPlayer: 527748,
  },
  text: [
    {
      title: "COMING, YOUR MOST LUGUBRIOUSNESS",
      description: "While this character has 5 {S} or more, he gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "8up-1",
      name: "COMING, YOUR MOST LUGUBRIOUSNESS",
      text: "COMING, YOUR MOST LUGUBRIOUSNESS While this character has 5 {S} or more, he gets +2 {L}.",
      type: "static",
      condition: {
        type: "stat-threshold",
        stat: "strength",
        value: 5,
        comparison: "greater-or-equal",
        target: "SELF",
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
    },
  ],
  i18n: painUnderworldImpI18n,
};
