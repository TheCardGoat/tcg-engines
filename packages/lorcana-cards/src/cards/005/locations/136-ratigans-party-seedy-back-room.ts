import type { LocationCard } from "@tcg/lorcana-types";

export const ratigansPartySeedyBackRoom: LocationCard = {
  id: "1nd",
  cardType: "location",
  name: "Ratigan's Party",
  version: "Seedy Back Room",
  fullName: "Ratigan's Party - Seedy Back Room",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "005",
  text: "MISFITS' REVELRY While you have a damaged character here, this location gets +2 {L}.",
  cost: 2,
  moveCost: 1,
  lore: 0,
  cardNumber: 136,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d7c49b894c3a37882bbb3d7e033724e8e84eb280",
  },
  abilities: [
    {
      id: "1nd-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "CHOSEN_CHARACTER",
      },
      text: "MISFITS' REVELRY While you have a damaged character here, this location gets +2 {L}.",
    },
  ],
};
