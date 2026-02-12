import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseLeaderOfTheBand: CharacterCard = {
  abilities: [
    {
      id: "1ow-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
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
      id: "1ow-2",
      name: "STRIKE UP THE MUSIC",
      text: "STRIKE UP THE MUSIC When you play this character, chosen character gains Support this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 15,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "db76b4423fa5a9cc7723c556824d7eeed5c20bf0",
  },
  fullName: "Mickey Mouse - Leader of the Band",
  id: "1ow",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mickey Mouse",
  set: "004",
  strength: 2,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nSTRIKE UP THE MUSIC When you play this character, chosen character gains Support this turn.",
  version: "Leader of the Band",
  willpower: 5,
};
