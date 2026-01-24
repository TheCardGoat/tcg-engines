import type { CharacterCard } from "@tcg/lorcana-types";

export const dumboNinthWonderOfTheUniverse: CharacterCard = {
  id: "181",
  cardType: "character",
  name: "Dumbo",
  version: "Ninth Wonder of the Universe",
  fullName: "Dumbo - Ninth Wonder of the Universe",
  inkType: ["amethyst"],
  franchise: "Dumbo",
  set: "009",
  text: 'Evasive (Only characters with Evasive can challenge this character.)\nBREAKING RECORDS {E}, 1 {I} – Draw a card and gain 1 lore.\nMAKING HISTORY Your other characters with Evasive gain "{E}, 1 {I} – Draw a card and gain 1 lore."',
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 45,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9f83ac8f13bb044cb3d019364b03009d2cde5683",
  },
  abilities: [
    {
      id: "181-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "181-2",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "gain-lore",
            amount: 1,
          },
        ],
      },
      text: "BREAKING RECORDS {E}, 1 {I} – Draw a card and gain 1 lore.",
    },
    {
      id: "181-3",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "gain-lore",
            amount: 1,
          },
        ],
      },
      text: 'MAKING HISTORY Your other characters with Evasive gain "{E}, 1 {I} – Draw a card and gain 1 lore."',
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
