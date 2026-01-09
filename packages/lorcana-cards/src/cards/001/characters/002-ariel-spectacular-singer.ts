import type { CharacterCard } from "@tcg/lorcana-types";

export const arielSpectacularSinger: CharacterCard = {
  id: "1k6",
  cardType: "character",
  name: "Ariel",
  version: "Spectacular Singer",
  fullName: "Ariel - Spectacular Singer",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "001",
  text: "Singer 5 (This character counts as cost 5 to sing songs.)\nMUSICAL DEBUT When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 2,
  inkable: true,
  externalIds: {
    ravensburger: "cae9d71be6c7f2ae989356aff5c1d3e307890630",
  },
  abilities: [
    {
      id: "1k6-1",
      text: "Singer 5",
      type: "keyword",
      keyword: "Singer",
      value: 5,
    },
    {
      id: "1k6-2",
      text: "MUSICAL DEBUT When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      name: "MUSICAL DEBUT",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "scry",
        amount: 4,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            filter: { type: "song" },
            reveal: true,
          },
          { zone: "deck-bottom", remainder: true, ordering: "player-choice" },
        ],
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
