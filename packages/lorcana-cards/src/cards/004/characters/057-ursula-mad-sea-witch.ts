import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaMadSeaWitch: CharacterCard = {
  id: "ui8",
  cardType: "character",
  name: "Ursula",
  version: "Mad Sea Witch",
  fullName: "Ursula - Mad Sea Witch",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 57,
  inkable: true,
  externalIds: {
    ravensburger: "6df2820402c29a10e4294b8b6703f720b6211791",
  },
  abilities: [
    {
      id: "ui8-1",
      text: "Challenger +2",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};
