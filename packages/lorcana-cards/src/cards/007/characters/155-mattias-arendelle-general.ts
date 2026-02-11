import type { CharacterCard } from "@tcg/lorcana-types";

export const mattiasArendelleGeneral: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
      id: "f9s-1",
      name: "PROUD TO SERVE Your Queen",
      text: "PROUD TO SERVE Your Queen characters gain Ward.",
      type: "static",
    },
  ],
  cardNumber: 155,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Knight"],
  cost: 2,
  externalIds: {
    ravensburger: "370ac9a4fe75cd66bd7260022d0a49e58bd67d78",
  },
  franchise: "Frozen",
  fullName: "Mattias - Arendelle General",
  id: "f9s",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mattias",
  set: "007",
  strength: 3,
  text: "PROUD TO SERVE Your Queen characters gain Ward. (Opponents can't choose them except to challenge.)",
  version: "Arendelle General",
  willpower: 2,
};
