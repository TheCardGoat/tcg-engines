import type { CharacterCard } from "@tcg/lorcana";

export const ursulaMadSeaWitch: CharacterCard = {
  id: "ui8",
  cardType: "character",
  name: "Ursula",
  version: "Mad Sea Witch",
  fullName: "Ursula - Mad Sea Witch",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Challenger +2 (While challenging, this character gets +2.)",
  cardNumber: "057",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "6df2820402c29a10e4294b8b6703f720b6211791",
  },
  keywords: [
    {
      type: "Challenger",
      value: 2,
    },
  ],
  abilities: [
    {
      id: "ui8a1",
      text: "Challenger +2",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};
