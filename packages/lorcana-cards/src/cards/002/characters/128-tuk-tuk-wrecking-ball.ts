import type { CharacterCard } from "@tcg/lorcana-types";

export const tukTukWreckingBall: CharacterCard = {
  id: "1or",
  cardType: "character",
  name: "Tuk Tuk",
  version: "Wrecking Ball",
  fullName: "Tuk Tuk - Wrecking Ball",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "Reckless (This character can't quest and must challenge each turn if able.)",
  cost: 4,
  strength: 4,
  willpower: 5,
  lore: 0,
  cardNumber: 128,
  inkable: false,
  externalIds: {
    ravensburger: "db06f844bce8daadacf3b667fc574090eded709d",
  },
  abilities: [
    {
      id: "1or-1",
      type: "keyword",
      keyword: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
