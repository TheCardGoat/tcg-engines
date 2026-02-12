import type { CharacterCard } from "@tcg/lorcana-types";

export const arielAdventurousCollector: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "1ws-1",
      name: "Evasive INSPIRING VOICE",
      text: "Evasive INSPIRING VOICE Whenever you play a song, chosen character of yours gains Evasive until the start of your next turn.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 107,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess"],
  cost: 3,
  externalIds: {
    ravensburger: "f7e66d8c4fd5a5802bb6f4e68dce23b54d59353b",
  },
  franchise: "Little Mermaid",
  fullName: "Ariel - Adventurous Collector",
  id: "1ws",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Ariel",
  set: "009",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.) INSPIRING VOICE Whenever you play a song, chosen character of yours gains Evasive until the start of your next turn.",
  version: "Adventurous Collector",
  willpower: 3,
};
