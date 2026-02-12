import type { CharacterCard } from "@tcg/lorcana-types";

export const jebidiahFarnsworthExpeditionCook: CharacterCard = {
  abilities: [
    {
      id: "1z1-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      effect: {
        keyword: "Resist",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 1,
      },
      id: "1z1-2",
      name: "I GOT YOUR FOUR BASIC FOOD GROUPS",
      text: "I GOT YOUR FOUR BASIC FOOD GROUPS When you play this character, chosen character gains Resist +1 until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 174,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "fffdd033322affbd2f0dbae5b6b9b13ef3984c6a",
  },
  franchise: "Atlantis",
  fullName: "Jebidiah Farnsworth - Expedition Cook",
  id: "1z1",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Jebidiah Farnsworth",
  set: "007",
  strength: 3,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nI GOT YOUR FOUR BASIC FOOD GROUPS When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  version: "Expedition Cook",
  willpower: 3,
};
