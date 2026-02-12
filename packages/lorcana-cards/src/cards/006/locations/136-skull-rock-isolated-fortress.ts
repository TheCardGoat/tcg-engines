import type { LocationCard } from "@tcg/lorcana-types";

export const skullRockIsolatedFortress: LocationCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "CHARACTERS_HERE",
        type: "modify-stat",
      },
      id: "1rj-1",
      name: "FAMILIAR GROUND",
      text: "FAMILIAR GROUND Characters get +1 {S} while here.",
      type: "static",
    },
    {
      effect: {
        condition: {
          type: "if",
          expression: "you have a Pirate character here",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
        type: "conditional",
      },
      id: "1rj-2",
      text: "SAFE HAVEN At the start of your turn, if you have a Pirate character here, gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 136,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "e456aa982e0a7666b3635ba389f60fac92eb572b",
  },
  franchise: "Peter Pan",
  fullName: "Skull Rock - Isolated Fortress",
  id: "1rj",
  inkType: ["ruby"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Skull Rock",
  set: "006",
  text: "FAMILIAR GROUND Characters get +1 {S} while here.\nSAFE HAVEN At the start of your turn, if you have a Pirate character here, gain 1 lore.",
  version: "Isolated Fortress",
};
