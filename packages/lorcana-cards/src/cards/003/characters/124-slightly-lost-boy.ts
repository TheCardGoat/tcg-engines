import type { CharacterCard } from "@tcg/lorcana-types";

export const slightlyLostBoy: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character named Peter Pan in play",
        },
        then: {
          type: "play-card",
          from: "hand",
        },
      },
      id: "1pb-1",
      text: "THE FOX If you have a character named Peter Pan in play, you pay 1 {I} less to play this character.",
      type: "action",
    },
    {
      id: "1pb-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
  cardNumber: 124,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "de6fe4fac9e60d6e1826bcce2255508984e7abfe",
  },
  franchise: "Peter Pan",
  fullName: "Slightly - Lost Boy",
  id: "1pb",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Slightly",
  set: "003",
  strength: 4,
  text: "THE FOX If you have a character named Peter Pan in play, you pay 1 {I} less to play this character.\nEvasive (Only characters with Evasive can challenge this character.)",
  version: "Lost Boy",
  willpower: 3,
};
