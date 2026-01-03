import type { CharacterCard } from "@tcg/lorcana-types";

export const princeEricSeafaringPrince: CharacterCard = {
  id: "98x",
  cardType: "character",
  name: "Prince Eric",
  version: "Seafaring Prince",
  fullName: "Prince Eric - Seafaring Prince",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose a character with Bodyguard if able.)",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 21,
  inkable: true,
  externalIds: {
    ravensburger: "215468ad3c809a1adc7ae0b14aa9d95e4875e52d",
  },
  abilities: [
    {
      id: "98x-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
};
