import type { CharacterCard } from "@tcg/lorcana";

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
  cardNumber: "106",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 0,
  inkable: false,
  vanilla: false,
  externalIds: {
    ravensburger: "f9389799f1792877b71c185b548e270163ef1c81",
  },
  keywords: ["Reckless"],
  abilities: [
    {
      id: "1xa-ability-1",
      text: "Reckless (This character can't quest and must challenge each turn if able.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
