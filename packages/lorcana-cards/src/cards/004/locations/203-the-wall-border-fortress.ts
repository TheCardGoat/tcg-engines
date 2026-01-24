import type { LocationCard } from "@tcg/lorcana-types";

export const theWallBorderFortress: LocationCard = {
  id: "1rp",
  cardType: "location",
  name: "The Wall",
  version: "Border Fortress",
  fullName: "The Wall - Border Fortress",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  text: "PROTECT THE REALM While you have an exerted character here, your other locations can't be challenged.",
  cost: 4,
  moveCost: 2,
  lore: 0,
  cardNumber: 203,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e5952f14f0c762b6186776b684752cbc36e40ac8",
  },
  abilities: [
    {
      id: "1rp-1",
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
      text: "PROTECT THE REALM While you have an exerted character here, your other locations can't be challenged.",
    },
  ],
};
