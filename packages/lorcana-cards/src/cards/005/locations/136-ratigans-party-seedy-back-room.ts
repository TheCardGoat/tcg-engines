import type { LocationCard } from "@tcg/lorcana-types";

export const ratigansPartySeedyBackRoom: LocationCard = {
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "lore",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "1nd-1",
      text: "MISFITS' REVELRY While you have a damaged character here, this location gets +2 {L}.",
      type: "action",
    },
  ],
  cardNumber: 136,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "d7c49b894c3a37882bbb3d7e033724e8e84eb280",
  },
  franchise: "Great Mouse Detective",
  fullName: "Ratigan's Party - Seedy Back Room",
  id: "1nd",
  inkType: ["ruby"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Ratigan's Party",
  set: "005",
  text: "MISFITS' REVELRY While you have a damaged character here, this location gets +2 {L}.",
  version: "Seedy Back Room",
};
