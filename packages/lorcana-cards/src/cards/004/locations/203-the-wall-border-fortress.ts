import type { LocationCard } from "@tcg/lorcana-types";

export const theWallBorderFortress: LocationCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
      },
      id: "1rp-1",
      text: "PROTECT THE REALM While you have an exerted character here, your other locations can't be challenged.",
      type: "action",
    },
  ],
  cardNumber: 203,
  cardType: "location",
  cost: 4,
  externalIds: {
    ravensburger: "e5952f14f0c762b6186776b684752cbc36e40ac8",
  },
  franchise: "Mulan",
  fullName: "The Wall - Border Fortress",
  id: "1rp",
  inkType: ["steel"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "The Wall",
  set: "004",
  text: "PROTECT THE REALM While you have an exerted character here, your other locations can't be challenged.",
  version: "Border Fortress",
};
