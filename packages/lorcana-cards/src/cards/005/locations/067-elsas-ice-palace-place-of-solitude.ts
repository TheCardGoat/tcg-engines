import type { LocationCard } from "@tcg/lorcana-types";

export const elsasIcePalacePlaceOfSolitude: LocationCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
      id: "1h5-1",
      name: "ETERNAL WINTER",
      text: "ETERNAL WINTER When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 67,
  cardType: "location",
  cost: 3,
  externalIds: {
    ravensburger: "bf43fd7fefe1c9af6f81222844d80806e88a2f61",
  },
  franchise: "Frozen",
  fullName: "Elsa's Ice Palace - Place of Solitude",
  id: "1h5",
  inkType: ["amethyst"],
  inkable: false,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Elsa's Ice Palace",
  set: "005",
  text: "ETERNAL WINTER When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.",
  version: "Place of Solitude",
};
