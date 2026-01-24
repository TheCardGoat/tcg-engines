import type { CharacterCard } from "@tcg/lorcana-types";

export const maidMarianDelightfulDreamer: CharacterCard = {
  id: "1p6",
  cardType: "character",
  name: "Maid Marian",
  version: "Delightful Dreamer",
  fullName: "Maid Marian - Delightful Dreamer",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "009",
  text: "HIGHBORN LADY When you play this character, chosen character gets -2 {S} this turn.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 158,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dc73989b7f4878a33e227c586b83d6f59aeef98c",
  },
  abilities: [
    {
      id: "1p6-1",
      type: "triggered",
      name: "HIGHBORN LADY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "HIGHBORN LADY When you play this character, chosen character gets -2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Princess"],
};
