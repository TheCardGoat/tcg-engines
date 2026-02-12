import type { CharacterCard } from "@tcg/lorcana-types";

export const treasureGuardianProtectorOfTheCave: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-challenge",
        target: "SELF",
        type: "restriction",
      },
      id: "1bw-1",
      name: "WHO DISTURBS MY SLUMBER?",
      text: "WHO DISTURBS MY SLUMBER? This character can't challenge or quest unless it is at a location.",
      type: "static",
    },
  ],
  cardNumber: 58,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 4,
  externalIds: {
    ravensburger: "acade7659b357fc4d7e2b6b6bd99e61e7df82605",
  },
  franchise: "Aladdin",
  fullName: "Treasure Guardian - Protector of the Cave",
  id: "1bw",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Treasure Guardian",
  set: "003",
  strength: 6,
  text: "WHO DISTURBS MY SLUMBER? This character can't challenge or quest unless it is at a location.",
  version: "Protector of the Cave",
  willpower: 6,
};
