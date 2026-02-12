import type { CharacterCard } from "@tcg/lorcana-types";

export const fidgetSneakyBat: CharacterCard = {
  abilities: [
    {
      id: "1lo-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
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
      id: "1lo-2",
      name: "I TOOK CARE OF EVERYTHING",
      text: "I TOOK CARE OF EVERYTHING Whenever this character quests, another chosen character of yours gains Evasive until the start of your next turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 106,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "cfdd9e04d6917aac14c9f8b2e100a587bf16ce09",
  },
  franchise: "Great Mouse Detective",
  fullName: "Fidget - Sneaky Bat",
  id: "1lo",
  inkType: ["emerald", "ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Fidget",
  set: "007",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nI TOOK CARE OF EVERYTHING Whenever this character quests, another chosen character of yours gains Evasive until the start of your next turn.",
  version: "Sneaky Bat",
  willpower: 3,
};
