import type { CharacterCard } from "@tcg/lorcana-types";

export const mrBigShrewdTycoon: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
      },
      id: "1lm-1",
      name: "REPUTATION",
      text: "REPUTATION This character can't be challenged by characters with 2 {S} or more.",
      type: "static",
    },
  ],
  cardNumber: 174,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 4,
  externalIds: {
    ravensburger: "cfadaa4f1260ce978c286c033244ecbd996c65ac",
  },
  franchise: "Zootropolis",
  fullName: "Mr. Big - Shrewd Tycoon",
  id: "1lm",
  inkType: ["steel"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Mr. Big",
  set: "006",
  strength: 1,
  text: "REPUTATION This character can't be challenged by characters with 2 {S} or more.",
  version: "Shrewd Tycoon",
  willpower: 1,
};
