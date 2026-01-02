import type { CharacterCard } from "@tcg/lorcana-types";

export const diabloSpitefulRaven: CharacterCard = {
  id: "1v4",
  cardType: "character",
  name: "Diablo",
  version: "Spiteful Raven",
  fullName: "Diablo - Spiteful Raven",
  inkType: ["amethyst", "emerald"],
  franchise: "Sleeping Beauty",
  set: "007",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nChallenger +2 (While challenging, this character gets +2 {S})",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 66,
  inkable: true,
  externalIds: {
    ravensburger: "f1e14998918b85b112c9a5038a782041079b1e7d",
  },
  abilities: [
    {
      id: "1v4-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "1v4-2",
      text: "Challenger +2",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
