import type { CharacterCard } from "@tcg/lorcana-types";

export const treasureGuardianProtectorOfTheCave: CharacterCard = {
  id: "1bw",
  cardType: "character",
  name: "Treasure Guardian",
  version: "Protector of the Cave",
  fullName: "Treasure Guardian - Protector of the Cave",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "003",
  text: "WHO DISTURBS MY SLUMBER? This character can't challenge or quest unless it is at a location.",
  cost: 4,
  strength: 6,
  willpower: 6,
  lore: 2,
  cardNumber: 58,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "acade7659b357fc4d7e2b6b6bd99e61e7df82605",
  },
  abilities: [
    {
      id: "1bw-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "SELF",
      },
      name: "WHO DISTURBS MY SLUMBER?",
      text: "WHO DISTURBS MY SLUMBER? This character can't challenge or quest unless it is at a location.",
    },
  ],
  classifications: ["Storyborn"],
};
