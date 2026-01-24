import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseLeaderOfTheBand: CharacterCard = {
  id: "1ow",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Leader of the Band",
  fullName: "Mickey Mouse - Leader of the Band",
  inkType: ["amber"],
  set: "004",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nSTRIKE UP THE MUSIC When you play this character, chosen character gains Support this turn.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 15,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "db76b4423fa5a9cc7723c556824d7eeed5c20bf0",
  },
  abilities: [
    {
      id: "1ow-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
    {
      id: "1ow-2",
      type: "triggered",
      name: "STRIKE UP THE MUSIC",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "STRIKE UP THE MUSIC When you play this character, chosen character gains Support this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
