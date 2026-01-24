import type { CharacterCard } from "@tcg/lorcana-types";

export const maxLoyalSheepdog: CharacterCard = {
  id: "1d6",
  cardType: "character",
  name: "Max",
  version: "Loyal Sheepdog",
  fullName: "Max - Loyal Sheepdog",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "004",
  text: "HERE BOY If you have a character named Prince Eric in play, you pay 1 {I} less to play this character.",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 14,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b250a8edcddaa91a173c4dbc846a67a388852f79",
  },
  abilities: [
    {
      id: "1d6-1",
      type: "action",
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
      text: "HERE BOY If you have a character named Prince Eric in play, you pay 1 {I} less to play this character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
