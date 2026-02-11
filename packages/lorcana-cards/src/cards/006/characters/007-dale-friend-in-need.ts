import type { CharacterCard } from "@tcg/lorcana-types";

export const daleFriendInNeed: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      id: "1pa-1",
      name: "CHIP'S PARTNER",
      text: "CHIP'S PARTNER This character enters play exerted unless you have a character named Chip in play.",
      type: "static",
    },
  ],
  cardNumber: 7,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "dcea84da6960a81b9536b7989764a6b80c735f6d",
  },
  franchise: "Rescue Rangers",
  fullName: "Dale - Friend in Need",
  id: "1pa",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Dale",
  set: "006",
  strength: 3,
  text: "CHIP'S PARTNER This character enters play exerted unless you have a character named Chip in play.",
  version: "Friend in Need",
  willpower: 4,
};
