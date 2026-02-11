import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaMadSeaWitch: CharacterCard = {
  abilities: [
    {
      id: "ui8-1",
      keyword: "Challenger",
      text: "Challenger +2",
      type: "keyword",
      value: 2,
    },
  ],
  cardNumber: 57,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  cost: 2,
  externalIds: {
    ravensburger: "6df2820402c29a10e4294b8b6703f720b6211791",
  },
  franchise: "Little Mermaid",
  fullName: "Ursula - Mad Sea Witch",
  id: "ui8",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Ursula",
  set: "004",
  strength: 1,
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)",
  version: "Mad Sea Witch",
  willpower: 3,
};
