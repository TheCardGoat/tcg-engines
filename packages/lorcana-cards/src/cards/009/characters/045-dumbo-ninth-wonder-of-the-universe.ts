import type { CharacterCard } from "@tcg/lorcana-types";

export const dumboNinthWonderOfTheUniverse: CharacterCard = {
  abilities: [
    {
      id: "181-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
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
      id: "181-2",
      text: "BREAKING RECORDS {E}, 1 {I} – Draw a card and gain 1 lore.",
      type: "action",
    },
    {
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
      id: "181-3",
      text: 'MAKING HISTORY Your other characters with Evasive gain "{E}, 1 {I} – Draw a card and gain 1 lore."',
      type: "action",
    },
  ],
  cardNumber: 45,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "9f83ac8f13bb044cb3d019364b03009d2cde5683",
  },
  franchise: "Dumbo",
  fullName: "Dumbo - Ninth Wonder of the Universe",
  id: "181",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Dumbo",
  set: "009",
  strength: 3,
  text: 'Evasive (Only characters with Evasive can challenge this character.)\nBREAKING RECORDS {E}, 1 {I} – Draw a card and gain 1 lore.\nMAKING HISTORY Your other characters with Evasive gain "{E}, 1 {I} – Draw a card and gain 1 lore."',
  version: "Ninth Wonder of the Universe",
  willpower: 3,
};
