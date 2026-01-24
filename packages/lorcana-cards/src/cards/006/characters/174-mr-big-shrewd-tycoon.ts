import type { CharacterCard } from "@tcg/lorcana-types";

export const mrBigShrewdTycoon: CharacterCard = {
  id: "1lm",
  cardType: "character",
  name: "Mr. Big",
  version: "Shrewd Tycoon",
  fullName: "Mr. Big - Shrewd Tycoon",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "006",
  text: "REPUTATION This character can't be challenged by characters with 2 {S} or more.",
  cost: 4,
  strength: 1,
  willpower: 1,
  lore: 3,
  cardNumber: 174,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "cfadaa4f1260ce978c286c033244ecbd996c65ac",
  },
  abilities: [
    {
      id: "1lm-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
      name: "REPUTATION",
      text: "REPUTATION This character can't be challenged by characters with 2 {S} or more.",
    },
  ],
  classifications: ["Storyborn"],
};
