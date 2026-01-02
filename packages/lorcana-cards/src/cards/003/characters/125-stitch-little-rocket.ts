import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchLittleRocket: CharacterCard = {
  id: "cgj",
  cardType: "character",
  name: "Stitch",
  version: "Little Rocket",
  fullName: "Stitch - Little Rocket",
  inkType: ["ruby"],
  franchise: "Lilo and Stitch",
  set: "003",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  cardNumber: 125,
  inkable: false,
  externalIds: {
    ravensburger: "2ce76e99fa3946189d8b3985a10b16a474034d40",
  },
  abilities: [
    {
      id: "cgj-1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Alien"],
};
