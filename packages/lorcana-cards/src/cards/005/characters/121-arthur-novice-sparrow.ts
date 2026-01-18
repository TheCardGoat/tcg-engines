import type { CharacterCard } from "@tcg/lorcana-types";

export const arthurNoviceSparrow: CharacterCard = {
  id: "bn1",
  cardType: "character",
  name: "Arthur",
  version: "Novice Sparrow",
  fullName: "Arthur - Novice Sparrow",
  inkType: ["ruby"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "Reckless (This character can't quest and must challenge each turn if able.)",
  cost: 1,
  strength: 2,
  willpower: 3,
  lore: 0,
  cardNumber: 121,
  inkable: false,
  externalIds: {
    ravensburger: "29f376ad78c551ed84b353cdcbe6ae4a1bceaa40",
  },
  abilities: [
    {
      id: "bn1-1",
      type: "keyword",
      keyword: "Reckless",
      text: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
