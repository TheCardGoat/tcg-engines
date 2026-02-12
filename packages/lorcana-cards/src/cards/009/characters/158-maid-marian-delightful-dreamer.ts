import type { CharacterCard } from "@tcg/lorcana-types";

export const maidMarianDelightfulDreamer: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -2,
        stat: "strength",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "modify-stat",
      },
      id: "1p6-1",
      name: "HIGHBORN LADY",
      text: "HIGHBORN LADY When you play this character, chosen character gets -2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 158,
  cardType: "character",
  classifications: ["Storyborn", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "dc73989b7f4878a33e227c586b83d6f59aeef98c",
  },
  franchise: "Robin Hood",
  fullName: "Maid Marian - Delightful Dreamer",
  id: "1p6",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Maid Marian",
  set: "009",
  strength: 4,
  text: "HIGHBORN LADY When you play this character, chosen character gets -2 {S} this turn.",
  version: "Delightful Dreamer",
  willpower: 4,
};
