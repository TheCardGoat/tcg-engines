import type { CharacterCard } from "@tcg/lorcana";

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
  keywords: ["Reckless"],
  abilities: [
    {
      id: "enf-1",
      text: "Reckless",
      type: "keyword",
      keyword: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
