import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseStandardBearer: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "k4b-1",
      name: "STAND STRONG",
      text: "STAND STRONG When you play this character, chosen character gains Challenger +2 this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 185,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "48839e24171f940246ad8c892880d562b4dcffc4",
  },
  fullName: "Mickey Mouse - Standard Bearer",
  id: "k4b",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mickey Mouse",
  set: "009",
  strength: 1,
  text: "STAND STRONG When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  version: "Standard Bearer",
  willpower: 3,
};
