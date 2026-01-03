import type { CharacterCard } from "@tcg/lorcana-types";

export const thePrinceVigilantSuitor: CharacterCard = {
  id: "ot0",
  cardType: "character",
  name: "The Prince",
  version: "Vigilant Suitor",
  fullName: "The Prince - Vigilant Suitor",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "007",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 2,
  strength: 0,
  willpower: 5,
  lore: 1,
  cardNumber: 24,
  inkable: false,
  externalIds: {
    ravensburger: "5966f7b1df7bd6ef309aa7694d0a45d89624c970",
  },
  abilities: [
    {
      id: "ot0-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
