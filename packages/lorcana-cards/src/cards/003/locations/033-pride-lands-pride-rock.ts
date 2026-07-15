import type { LocationCard } from "@tcg/lorcana-types";

export const prideLandsPrideRock: LocationCard = {
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "willpower",
        target: "CHARACTERS_HERE",
        type: "modify-stat",
      },
      id: "1ph-1",
      name: "WE ARE ALL CONNECTED",
      text: "WE ARE ALL CONNECTED Characters get +2 {W} while here.",
      type: "static",
    },
    {
      effect: {
        condition: {
          expression: "you have a Prince or King character here",
          type: "if",
        },
        then: {
          from: "hand",
          type: "play-card",
        },
        type: "conditional",
      },
      id: "1ph-2",
      text: "LION HOME If you have a Prince or King character here, you pay 1 {I} less to play characters.",
      type: "action",
    },
  ],
  cardNumber: 33,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "df2e59641883d44ec34c12b9ba600f92f8be0ec2",
  },
  franchise: "Lion King",
  fullName: "Pride Lands - Pride Rock",
  id: "1ph",
  inkType: ["amber"],
  inkable: false,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "Pride Lands",
  set: "003",
  text: "WE ARE ALL CONNECTED Characters get +2 {W} while here.\nLION HOME If you have a Prince or King character here, you pay 1 {I} less to play characters.",
  version: "Pride Rock",
};
