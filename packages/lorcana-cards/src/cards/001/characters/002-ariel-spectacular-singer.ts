import type { CharacterCard } from "@tcg/lorcana-types";

export const arielSpectacularSinger: CharacterCard = {
  abilities: [
    {
      id: "1k6-1",
      keyword: "Singer",
      text: "Singer 5",
      type: "keyword",
      value: 5,
    },
    {
      effect: {
        amount: 4,
        destinations: [
          {
            filter: { type: "song" },
            max: 1,
            min: 0,
            reveal: true,
            zone: "hand",
          },
          { ordering: "player-choice", remainder: true, zone: "deck-bottom" },
        ],
        type: "scry",
      },
      id: "1k6-2",
      name: "MUSICAL DEBUT",
      text: "MUSICAL DEBUT When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 2,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 3,
  externalIds: {
    ravensburger: "cae9d71be6c7f2ae989356aff5c1d3e307890630",
  },
  franchise: "Little Mermaid",
  fullName: "Ariel - Spectacular Singer",
  id: "1k6",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  name: "Ariel",
  set: "001",
  strength: 2,
  text: "Singer 5 (This character counts as cost 5 to sing songs.)\nMUSICAL DEBUT When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  version: "Spectacular Singer",
  willpower: 3,
};
