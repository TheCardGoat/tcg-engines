import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseDaringDefender: CharacterCard = {
  id: "7k3",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Daring Defender",
  fullName: "Minnie Mouse - Daring Defender",
  inkType: ["amber", "ruby"],
  set: "008",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nTRUE VALOR This character gets +1 {S} for each 1 damage on her.",
  cost: 4,
  strength: 0,
  willpower: 8,
  lore: 1,
  cardNumber: 6,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1b3d746d7aa4f780ac8c228578c6f4d72b29685a",
  },
  abilities: [
    {
      id: "7k3-1",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
    {
      id: "7k3-2",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      text: "TRUE VALOR This character gets +1 {S} for each 1 damage on her.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
