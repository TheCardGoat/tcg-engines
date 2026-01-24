import type { CharacterCard } from "@tcg/lorcana-types";

export const gizmoduckSuitedUp: CharacterCard = {
  id: "q1q",
  cardType: "character",
  name: "Gizmoduck",
  version: "Suited Up",
  fullName: "Gizmoduck - Suited Up",
  inkType: ["emerald", "steel"],
  franchise: "Ducktales",
  set: "007",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nBLATHERING BLATHERSKITE This character can challenge ready damaged characters.",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 105,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5de1016b1e0ec1f3f0b71db04b7c8ad9001d766d",
  },
  abilities: [
    {
      id: "q1q-1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
      text: "Resist +1",
    },
  ],
  classifications: ["Storyborn", "Inventor"],
};
