import type { CharacterCard } from "@tcg/lorcana-types";

export const dellaDuckUnstoppableMom: CharacterCard = {
  id: "1xa",
  cardType: "character",
  name: "Della Duck",
  version: "Unstoppable Mom",
  fullName: "Della Duck - Unstoppable Mom",
  inkType: ["ruby"],
  franchise: "Ducktales",
  set: "003",
  text: "Reckless (This character can't quest and must challenge each turn if able.)",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 0,
  cardNumber: 106,
  inkable: false,
  externalIds: {
    ravensburger: "f9389799f1792877b71c185b548e270163ef1c81",
  },
  abilities: [
    {
      id: "1xa-1",
      text: "Reckless",
      type: "keyword",
      keyword: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
