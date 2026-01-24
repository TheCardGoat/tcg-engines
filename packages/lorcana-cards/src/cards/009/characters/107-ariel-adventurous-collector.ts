import type { CharacterCard } from "@tcg/lorcana-types";

export const arielAdventurousCollector: CharacterCard = {
  id: "1ws",
  cardType: "character",
  name: "Ariel",
  version: "Adventurous Collector",
  fullName: "Ariel - Adventurous Collector",
  inkType: ["ruby"],
  franchise: "Little Mermaid",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.) INSPIRING VOICE Whenever you play a song, chosen character of yours gains Evasive until the start of your next turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 107,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f7e66d8c4fd5a5802bb6f4e68dce23b54d59353b",
  },
  abilities: [
    {
      id: "1ws-1",
      type: "triggered",
      name: "Evasive INSPIRING VOICE",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
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
      text: "Evasive INSPIRING VOICE Whenever you play a song, chosen character of yours gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
