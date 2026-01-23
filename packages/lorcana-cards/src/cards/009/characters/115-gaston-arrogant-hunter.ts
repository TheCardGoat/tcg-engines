import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonArrogantHunter: CharacterCard = {
  id: "enf",
  cardType: "character",
  name: "Gaston",
  version: "Arrogant Hunter",
  fullName: "Gaston - Arrogant Hunter",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "Reckless (This character can't quest and must challenge each turn if able.)",
  cost: 2,
  strength: 4,
  willpower: 2,
  lore: 0,
  cardNumber: 115,
  inkable: true,
  externalIds: {
    ravensburger: "34cd6eb73f7b4b7dd53a239a0dedfdf75cb2efbc",
  },
  abilities: [
    {
      id: "enf-1",
      type: "keyword",
      keyword: "Reckless",
      text: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
