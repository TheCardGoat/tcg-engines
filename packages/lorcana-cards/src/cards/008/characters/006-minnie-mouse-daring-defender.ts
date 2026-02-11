import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseDaringDefender: CharacterCard = {
  abilities: [
    {
      id: "7k3-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      id: "7k3-2",
      text: "TRUE VALOR This character gets +1 {S} for each 1 damage on her.",
      type: "static",
    },
  ],
  cardNumber: 6,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "1b3d746d7aa4f780ac8c228578c6f4d72b29685a",
  },
  fullName: "Minnie Mouse - Daring Defender",
  id: "7k3",
  inkType: ["amber", "ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Minnie Mouse",
  set: "008",
  strength: 0,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nTRUE VALOR This character gets +1 {S} for each 1 damage on her.",
  version: "Daring Defender",
  willpower: 8,
};
