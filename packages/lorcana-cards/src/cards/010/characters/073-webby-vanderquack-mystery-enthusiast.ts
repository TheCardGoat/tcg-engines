import type { CharacterCard } from "@tcg/lorcana-types";

export const webbyVanderquackMysteryEnthusiast: CharacterCard = {
  id: "1kd",
  cardType: "character",
  name: "Webby Vanderquack",
  version: "Mystery Enthusiast",
  fullName: "Webby Vanderquack - Mystery Enthusiast",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  text: "CONTAGIOUS ENERGY When you play this character, chosen character gets +1 {S} this turn.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 73,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cb242024f4792a7b34ea392bfe4dd7009f475856",
  },
  abilities: [
    {
      id: "1kd-1",
      type: "triggered",
      name: "CONTAGIOUS ENERGY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "CONTAGIOUS ENERGY When you play this character, chosen character gets +1 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
