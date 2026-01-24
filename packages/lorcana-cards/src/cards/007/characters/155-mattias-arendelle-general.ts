import type { CharacterCard } from "@tcg/lorcana-types";

export const mattiasArendelleGeneral: CharacterCard = {
  id: "f9s",
  cardType: "character",
  name: "Mattias",
  version: "Arendelle General",
  fullName: "Mattias - Arendelle General",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "007",
  text: "PROUD TO SERVE Your Queen characters gain Ward. (Opponents can't choose them except to challenge.)",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 155,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "370ac9a4fe75cd66bd7260022d0a49e58bd67d78",
  },
  abilities: [
    {
      id: "f9s-1",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
      name: "PROUD TO SERVE Your Queen",
      text: "PROUD TO SERVE Your Queen characters gain Ward.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Knight"],
};
