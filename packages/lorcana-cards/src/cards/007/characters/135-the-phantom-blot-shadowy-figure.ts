import type { CharacterCard } from "@tcg/lorcana-types";

export const thePhantomBlotShadowyFigure: CharacterCard = {
  id: "1wy",
  cardType: "character",
  name: "The Phantom Blot",
  version: "Shadowy Figure",
  fullName: "The Phantom Blot - Shadowy Figure",
  inkType: ["ruby"],
  set: "007",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  cardNumber: 135,
  inkable: false,
  externalIds: {
    ravensburger: "f87fff900b6d5596c88b04100c0a87c2c9346faa",
  },
  abilities: [
    {
      id: "1wy-1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
