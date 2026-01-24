import type { CharacterCard } from "@tcg/lorcana-types";

export const fidgetSneakyBat: CharacterCard = {
  id: "1lo",
  cardType: "character",
  name: "Fidget",
  version: "Sneaky Bat",
  fullName: "Fidget - Sneaky Bat",
  inkType: ["emerald", "ruby"],
  franchise: "Great Mouse Detective",
  set: "007",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nI TOOK CARE OF EVERYTHING Whenever this character quests, another chosen character of yours gains Evasive until the start of your next turn.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 106,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cfdd9e04d6917aac14c9f8b2e100a587bf16ce09",
  },
  abilities: [
    {
      id: "1lo-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1lo-2",
      type: "triggered",
      name: "I TOOK CARE OF EVERYTHING",
      trigger: {
        event: "quest",
        timing: "whenever",
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
      text: "I TOOK CARE OF EVERYTHING Whenever this character quests, another chosen character of yours gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
