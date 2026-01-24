import type { CharacterCard } from "@tcg/lorcana-types";

export const jebidiahFarnsworthExpeditionCook: CharacterCard = {
  id: "1z1",
  cardType: "character",
  name: "Jebidiah Farnsworth",
  version: "Expedition Cook",
  fullName: "Jebidiah Farnsworth - Expedition Cook",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "007",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nI GOT YOUR FOUR BASIC FOOD GROUPS When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 174,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fffdd033322affbd2f0dbae5b6b9b13ef3984c6a",
  },
  abilities: [
    {
      id: "1z1-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
    {
      id: "1z1-2",
      type: "triggered",
      name: "I GOT YOUR FOUR BASIC FOOD GROUPS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        value: 1,
      },
      text: "I GOT YOUR FOUR BASIC FOOD GROUPS When you play this character, chosen character gains Resist +1 until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
