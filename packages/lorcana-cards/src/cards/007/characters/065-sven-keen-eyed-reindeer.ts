import type { CharacterCard } from "@tcg/lorcana-types";

export const svenKeeneyedReindeer: CharacterCard = {
  abilities: [
    {
      id: "dna-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      effect: {
        duration: "this-turn",
        modifier: -3,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "dna-2",
      name: "FORMIDABLE GLARE",
      text: "FORMIDABLE GLARE When you play this character, chosen character gets -3 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 65,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "312f59abb5f525980eb98ed6d167aea1da0b2188",
  },
  franchise: "Frozen",
  fullName: "Sven - Keen-Eyed Reindeer",
  id: "dna",
  inkType: ["amethyst", "sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Sven",
  set: "007",
  strength: 2,
  text: "Rush (This character can challenge the turn they're played.)\nFORMIDABLE GLARE When you play this character, chosen character gets -3 {S} this turn.",
  version: "Keen-Eyed Reindeer",
  willpower: 6,
};
