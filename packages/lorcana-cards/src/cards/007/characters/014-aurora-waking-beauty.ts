import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraWakingBeauty: CharacterCard = {
  abilities: [
    {
      id: "cy2-1",
      keyword: "Singer",
      text: "Singer 5",
      type: "keyword",
      value: 5,
    },
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: {
              selector: "self",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "this-turn",
          },
        ],
      },
      id: "cy2-2",
      name: "SWEET DREAMS",
      text: "SWEET DREAMS Whenever you remove 1 or more damage from a character, ready this character. She can't quest or challenge for the rest of this turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 14,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 3,
  externalIds: {
    ravensburger: "2ea925b3bcd4e58c5bd1d5bb775db0d24bf1d993",
  },
  franchise: "Sleeping Beauty",
  fullName: "Aurora - Waking Beauty",
  id: "cy2",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Aurora",
  set: "007",
  strength: 1,
  text: "Singer 5 (This character counts as cost 5 to sing songs.)\nSWEET DREAMS Whenever you remove 1 or more damage from a character, ready this character. She can't quest or challenge for the rest of this turn.",
  version: "Waking Beauty",
  willpower: 4,
};
