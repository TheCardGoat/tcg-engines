import type { CharacterCard } from "@tcg/lorcana-types";

export const flounderCollectorsCompanion: CharacterCard = {
  id: "1n4",
  cardType: "character",
  name: "Flounder",
  version: "Collector’s Companion",
  fullName: "Flounder - Collector’s Companion",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nI'M NOT A GUPPY If you have a character named Ariel in play, you pay 1 {I} less to play this character.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 144,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d4f095ececf389f66e791196bb022e2cf87d3e4c",
  },
  abilities: [
    {
      id: "1n4-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
    {
      id: "1n4-2",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character named Ariel in play",
        },
        then: {
          type: "play-card",
          from: "hand",
        },
      },
      text: "I'M NOT A GUPPY If you have a character named Ariel in play, you pay 1 {I} less to play this character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
