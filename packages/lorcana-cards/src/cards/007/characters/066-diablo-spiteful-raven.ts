import type { CharacterCard } from "@tcg/lorcana-types";

export const diabloSpitefulRaven: CharacterCard = {
  abilities: [
    {
      id: "1v4-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      id: "1v4-2",
      keyword: "Challenger",
      text: "Challenger +2",
      type: "keyword",
      value: 2,
    },
  ],
  cardNumber: 66,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "f1e14998918b85b112c9a5038a782041079b1e7d",
  },
  franchise: "Sleeping Beauty",
  fullName: "Diablo - Spiteful Raven",
  id: "1v4",
  inkType: ["amethyst", "emerald"],
  inkable: true,
  lore: 1,
  name: "Diablo",
  set: "007",
  strength: 1,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nChallenger +2 (While challenging, this character gets +2 {S})",
  version: "Spiteful Raven",
  willpower: 2,
};
