import type { CharacterCard } from "@tcg/lorcana";

export const snowannaRainbeauCoolCompetitor: CharacterCard = {
  id: "rgl",
  cardType: "character",
  name: "Snowanna Rainbeau",
  version: "Cool Competitor",
  fullName: "Snowanna Rainbeau - Cool Competitor",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "Rush (This character can challenge the turn they're played.)",
  cardNumber: "110",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    ravensburger: "62f8f59f90124ef9f0b9787ccf4611aaf361be9f",
  },
  keywords: ["Rush"],
  abilities: [
    {
      id: "rgla1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
  ],
  classifications: ["Storyborn", "Ally", "Racer"],
};
