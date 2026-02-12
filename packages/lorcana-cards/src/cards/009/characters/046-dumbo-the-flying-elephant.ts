import type { CharacterCard } from "@tcg/lorcana-types";

export const dumboTheFlyingElephant: CharacterCard = {
  abilities: [
    {
      id: "ab9-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        keyword: "Evasive",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "ab9-2",
      name: "AERIAL DUO",
      text: "AERIAL DUO When you play this character, chosen character gains Evasive until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 46,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "252b4d93bdf671a8ad7c6c28742c3add6473ac4b",
  },
  franchise: "Dumbo",
  fullName: "Dumbo - The Flying Elephant",
  id: "ab9",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Dumbo",
  set: "009",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nAERIAL DUO When you play this character, chosen character gains Evasive until the start of your next turn.",
  version: "The Flying Elephant",
  willpower: 2,
};
