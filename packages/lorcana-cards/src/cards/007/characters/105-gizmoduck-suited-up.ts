import type { CharacterCard } from "@tcg/lorcana-types";

export const gizmoduckSuitedUp: CharacterCard = {
  abilities: [
    {
      id: "q1q-1",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
  ],
  cardNumber: 105,
  cardType: "character",
  classifications: ["Storyborn", "Inventor"],
  cost: 4,
  externalIds: {
    ravensburger: "5de1016b1e0ec1f3f0b71db04b7c8ad9001d766d",
  },
  franchise: "Ducktales",
  fullName: "Gizmoduck - Suited Up",
  id: "q1q",
  inkType: ["emerald", "steel"],
  inkable: true,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Gizmoduck",
  set: "007",
  strength: 4,
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nBLATHERING BLATHERSKITE This character can challenge ready damaged characters.",
  version: "Suited Up",
  willpower: 3,
};
