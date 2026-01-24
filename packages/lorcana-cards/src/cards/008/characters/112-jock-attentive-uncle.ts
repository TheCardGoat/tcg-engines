import type { CharacterCard } from "@tcg/lorcana-types";

export const jockAttentiveUncle: CharacterCard = {
  id: "17d",
  cardType: "character",
  name: "Jock",
  version: "Attentive Uncle",
  fullName: "Jock - Attentive Uncle",
  inkType: ["emerald"],
  franchise: "Lady and the Tramp",
  set: "008",
  text: "VOICE OF EXPERIENCE When you play this character, if you have 3 or more other characters in play, gain 2 lore.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 112,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9c55a800d6a784ae7201366f10c1d17a618ac0f9",
  },
  abilities: [
    {
      id: "17d-1",
      type: "triggered",
      name: "VOICE OF EXPERIENCE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have 3 or more other characters in play",
        },
        then: {
          type: "gain-lore",
          amount: 2,
        },
      },
      text: "VOICE OF EXPERIENCE When you play this character, if you have 3 or more other characters in play, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
