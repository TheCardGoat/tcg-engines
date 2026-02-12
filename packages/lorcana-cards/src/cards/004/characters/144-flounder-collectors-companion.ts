import type { CharacterCard } from "@tcg/lorcana-types";

export const flounderCollectorsCompanion: CharacterCard = {
  abilities: [
    {
      id: "1n4-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      effect: {
        condition: {
          expression: "you have a character named Ariel in play",
          type: "if",
        },
        then: {
          from: "hand",
          type: "play-card",
        },
        type: "conditional",
      },
      id: "1n4-2",
      text: "I'M NOT A GUPPY If you have a character named Ariel in play, you pay 1 {I} less to play this character.",
      type: "action",
    },
  ],
  cardNumber: 144,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "d4f095ececf389f66e791196bb022e2cf87d3e4c",
  },
  franchise: "Little Mermaid",
  fullName: "Flounder - Collector’s Companion",
  id: "1n4",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Flounder",
  set: "004",
  strength: 2,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nI'M NOT A GUPPY If you have a character named Ariel in play, you pay 1 {I} less to play this character.",
  version: "Collector’s Companion",
  willpower: 2,
};
