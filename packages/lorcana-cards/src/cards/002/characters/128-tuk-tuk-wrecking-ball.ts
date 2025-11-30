import type { CharacterCard } from "@tcg/lorcana";

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
  cardNumber: "128",
  cost: 4,
  strength: 4,
  willpower: 5,
  lore: 0,
  inkable: false,
  externalIds: {
    ravensburger: "db06f844bce8daadacf3b667fc574090eded709d",
  },
  keywords: ["Reckless"],
  abilities: [
    {
      id: "1ora1",
      text: "Reckless",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
