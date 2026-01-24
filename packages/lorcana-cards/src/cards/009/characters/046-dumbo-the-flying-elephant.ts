import type { CharacterCard } from "@tcg/lorcana-types";

export const dumboTheFlyingElephant: CharacterCard = {
  id: "ab9",
  cardType: "character",
  name: "Dumbo",
  version: "The Flying Elephant",
  fullName: "Dumbo - The Flying Elephant",
  inkType: ["amethyst"],
  franchise: "Dumbo",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nAERIAL DUO When you play this character, chosen character gains Evasive until the start of your next turn.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 46,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "252b4d93bdf671a8ad7c6c28742c3add6473ac4b",
  },
  abilities: [
    {
      id: "ab9-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "ab9-2",
      type: "triggered",
      name: "AERIAL DUO",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "AERIAL DUO When you play this character, chosen character gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
