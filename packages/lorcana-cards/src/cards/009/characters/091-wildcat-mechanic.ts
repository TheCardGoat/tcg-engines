import type { CharacterCard } from "@tcg/lorcana-types";

export const wildcatMechanic: CharacterCard = {
  abilities: [
    {
      id: "1nh-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
  cardNumber: 91,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "d65da805f8e4842f708b27639020b476a285cbb7",
  },
  franchise: "Talespin",
  fullName: "Wildcat - Mechanic",
  id: "1nh",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Wildcat",
  set: "009",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nDISASSEMBLE {E} – Banish chosen item.",
  version: "Mechanic",
  willpower: 3,
};
