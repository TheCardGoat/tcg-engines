import type { CharacterCard } from "@tcg/lorcana-types";

export const maxLoyalSheepdog: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character named Prince Eric in play",
        },
        then: {
          type: "play-card",
          from: "hand",
        },
      },
      id: "1d6-1",
      text: "HERE BOY If you have a character named Prince Eric in play, you pay 1 {I} less to play this character.",
      type: "action",
    },
  ],
  cardNumber: 14,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "b250a8edcddaa91a173c4dbc846a67a388852f79",
  },
  franchise: "Little Mermaid",
  fullName: "Max - Loyal Sheepdog",
  id: "1d6",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Max",
  set: "004",
  strength: 4,
  text: "HERE BOY If you have a character named Prince Eric in play, you pay 1 {I} less to play this character.",
  version: "Loyal Sheepdog",
  willpower: 3,
};
