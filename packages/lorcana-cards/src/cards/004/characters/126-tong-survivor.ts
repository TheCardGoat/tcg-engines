import type { CharacterCard } from "@tcg/lorcana-types";

export const tongSurvivor: CharacterCard = {
  id: "qqa",
  cardType: "character",
  name: "Tong",
  version: "Survivor",
  fullName: "Tong - Survivor",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  text: "Reckless (This character can't quest and must challenge each turn if able.)",
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 0,
  cardNumber: 126,
  inkable: false,
  externalIds: {
    ravensburger: "605680cde1ad7c1f3add90d42b8193ca0e197da6",
  },
  abilities: [
    {
      id: "qqa-1",
      type: "keyword",
      keyword: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
