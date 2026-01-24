import type { CharacterCard } from "@tcg/lorcana-types";

export const svenKeeneyedReindeer: CharacterCard = {
  id: "dna",
  cardType: "character",
  name: "Sven",
  version: "Keen-Eyed Reindeer",
  fullName: "Sven - Keen-Eyed Reindeer",
  inkType: ["amethyst", "sapphire"],
  franchise: "Frozen",
  set: "007",
  text: "Rush (This character can challenge the turn they're played.)\nFORMIDABLE GLARE When you play this character, chosen character gets -3 {S} this turn.",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 1,
  cardNumber: 65,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "312f59abb5f525980eb98ed6d167aea1da0b2188",
  },
  abilities: [
    {
      id: "dna-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
    {
      id: "dna-2",
      type: "triggered",
      name: "FORMIDABLE GLARE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -3,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "FORMIDABLE GLARE When you play this character, chosen character gets -3 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
