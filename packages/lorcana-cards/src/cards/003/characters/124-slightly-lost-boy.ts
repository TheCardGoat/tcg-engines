import type { CharacterCard } from "@tcg/lorcana-types";

export const slightlyLostBoy: CharacterCard = {
  id: "1pb",
  cardType: "character",
  name: "Slightly",
  version: "Lost Boy",
  fullName: "Slightly - Lost Boy",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "003",
  text: "THE FOX If you have a character named Peter Pan in play, you pay 1 {I} less to play this character.\nEvasive (Only characters with Evasive can challenge this character.)",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 124,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "de6fe4fac9e60d6e1826bcce2255508984e7abfe",
  },
  abilities: [
    {
      id: "1pb-1",
      type: "action",
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
      text: "THE FOX If you have a character named Peter Pan in play, you pay 1 {I} less to play this character.",
    },
    {
      id: "1pb-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
