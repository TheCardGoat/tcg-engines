import type { CharacterCard } from "@tcg/lorcana-types";

export const daleFriendInNeed: CharacterCard = {
  id: "1pa",
  cardType: "character",
  name: "Dale",
  version: "Friend in Need",
  fullName: "Dale - Friend in Need",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  text: "CHIP'S PARTNER This character enters play exerted unless you have a character named Chip in play.",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 7,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dcea84da6960a81b9536b7989764a6b80c735f6d",
  },
  abilities: [
    {
      id: "1pa-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      name: "CHIP'S PARTNER",
      text: "CHIP'S PARTNER This character enters play exerted unless you have a character named Chip in play.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
