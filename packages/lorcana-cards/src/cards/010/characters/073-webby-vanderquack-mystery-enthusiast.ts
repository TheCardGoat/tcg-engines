import type { CharacterCard } from "@tcg/lorcana-types";

export const webbyVanderquackMysteryEnthusiast: CharacterCard = {
  abilities: [
    {
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
      id: "1kd-1",
      name: "CONTAGIOUS ENERGY",
      text: "CONTAGIOUS ENERGY When you play this character, chosen character gets +1 {S} this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 73,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "cb242024f4792a7b34ea392bfe4dd7009f475856",
  },
  franchise: "Ducktales",
  fullName: "Webby Vanderquack - Mystery Enthusiast",
  id: "1kd",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Webby Vanderquack",
  set: "010",
  strength: 1,
  text: "CONTAGIOUS ENERGY When you play this character, chosen character gets +1 {S} this turn.",
  version: "Mystery Enthusiast",
  willpower: 2,
};
