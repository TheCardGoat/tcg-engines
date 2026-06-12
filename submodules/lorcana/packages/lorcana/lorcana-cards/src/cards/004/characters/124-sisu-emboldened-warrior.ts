import type { CharacterCard } from "@tcg/lorcana-types";
import { sisuEmboldenedWarriorI18n } from "./124-sisu-emboldened-warrior.i18n";

export const sisuEmboldenedWarrior: CharacterCard = {
  id: "TMv",
  canonicalId: "ci_rQr",
  reprints: ["set4-124", "set9-118"],
  cardType: "character",
  name: "Sisu",
  version: "Emboldened Warrior",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  cardNumber: 124,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_03cbb7961ddc4db7b724f1a934e1114b",
    tcgPlayer: 650054,
  },
  text: [
    {
      title: "SURGE OF POWER",
      description: "This character gets +1 {S} for each card in opponents' hands.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
  abilities: [
    {
      effect: {
        modifier: {
          type: "cards-in-hand",
          controller: "opponents",
        },
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1df-1",
      name: "SURGE OF POWER",
      text: "SURGE OF POWER This character gets +1 {S} for each card in opponents' hands.",
      type: "static",
    },
  ],
  i18n: sisuEmboldenedWarriorI18n,
};
