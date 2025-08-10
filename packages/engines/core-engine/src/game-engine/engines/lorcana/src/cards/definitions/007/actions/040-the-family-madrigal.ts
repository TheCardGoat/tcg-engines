import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theFamilyMadrigal: LorcanaActionCardDefinition = {
  id: "pol",
  name: "The Family Madrigal",
  characteristics: ["song", "action"],
  text: "(A character with cost 5 or more can {E} to sing this song for free.)\nLook at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand. Put the rest on the top of your deck in any order.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand. Put the rest on the top of your deck in any order.",
      effects: [],
    },
  ],
  inkwell: true,
  colors: ["amber", "amethyst"],
  cost: 5,
  illustrator: "Juan Diego Leon",
  number: 40,
  set: "007",
  rarity: "rare",
};
