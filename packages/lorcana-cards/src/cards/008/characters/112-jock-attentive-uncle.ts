import type { CharacterCard } from "@tcg/lorcana-types";

export const jockAttentiveUncle: CharacterCard = {
  abilities: [
    {
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
      id: "17d-1",
      name: "VOICE OF EXPERIENCE",
      text: "VOICE OF EXPERIENCE When you play this character, if you have 3 or more other characters in play, gain 2 lore.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 112,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "9c55a800d6a784ae7201366f10c1d17a618ac0f9",
  },
  franchise: "Lady and the Tramp",
  fullName: "Jock - Attentive Uncle",
  id: "17d",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Jock",
  set: "008",
  strength: 3,
  text: "VOICE OF EXPERIENCE When you play this character, if you have 3 or more other characters in play, gain 2 lore.",
  version: "Attentive Uncle",
  willpower: 4,
};
