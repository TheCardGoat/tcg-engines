import type { CharacterCard } from "@tcg/lorcana-types";

export const wildcatMechanic: CharacterCard = {
  id: "1nh",
  cardType: "character",
  name: "Wildcat",
  version: "Mechanic",
  fullName: "Wildcat - Mechanic",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nDISASSEMBLE {E} – Banish chosen item.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 91,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d65da805f8e4842f708b27639020b476a285cbb7",
  },
  abilities: [
    {
      id: "1nh-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
