import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraWakingBeauty: CharacterCard = {
  id: "cy2",
  cardType: "character",
  name: "Aurora",
  version: "Waking Beauty",
  fullName: "Aurora - Waking Beauty",
  inkType: ["amber"],
  franchise: "Sleeping Beauty",
  set: "007",
  text: "Singer 5 (This character counts as cost 5 to sing songs.)\nSWEET DREAMS Whenever you remove 1 or more damage from a character, ready this character. She can't quest or challenge for the rest of this turn.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 14,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2ea925b3bcd4e58c5bd1d5bb775db0d24bf1d993",
  },
  abilities: [
    {
      id: "cy2-1",
      type: "keyword",
      keyword: "Singer",
      value: 5,
      text: "Singer 5",
    },
    {
      id: "cy2-2",
      type: "triggered",
      name: "SWEET DREAMS",
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
      text: "SWEET DREAMS Whenever you remove 1 or more damage from a character, ready this character. She can't quest or challenge for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
