import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseStandardBearer: CharacterCard = {
  id: "k4b",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Standard Bearer",
  fullName: "Mickey Mouse - Standard Bearer",
  inkType: ["steel"],
  set: "009",
  text: "STAND STRONG When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 185,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "48839e24171f940246ad8c892880d562b4dcffc4",
  },
  abilities: [
    {
      id: "k4b-1",
      type: "triggered",
      name: "STAND STRONG",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        value: 2,
        duration: "this-turn",
      },
      text: "STAND STRONG When you play this character, chosen character gains Challenger +2 this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
