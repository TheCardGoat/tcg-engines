import type { CharacterCard } from "@tcg/lorcana-types";

export const webbyVanderquackMysteryEnthusiast: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "1kd-1",
      name: "CONTAGIOUS ENERGY",
      text: "CONTAGIOUS ENERGY When you play this character, chosen character gets +1 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
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
