import type { CharacterCard } from "@tcg/lorcana-types";

export const princeNaveenVigilantFirstMate: CharacterCard = {
  id: "1hg",
  cardType: "character",
  name: "Prince Naveen",
  version: "Vigilant First Mate",
  fullName: "Prince Naveen - Vigilant First Mate",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "006",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Prince Naveen.)\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 9,
  inkable: true,
  externalIds: {
    ravensburger: "c0abf4ad2073b023e3021c1547836aab812568ff",
  },
  abilities: [
    {
      id: "1hg-1",
      text: "Shift 3",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    },
    {
      id: "1hg-2",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
};
