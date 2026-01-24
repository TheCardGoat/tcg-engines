import type { LocationCard } from "@tcg/lorcana-types";

export const skullRockIsolatedFortress: LocationCard = {
  id: "1rj",
  cardType: "location",
  name: "Skull Rock",
  version: "Isolated Fortress",
  fullName: "Skull Rock - Isolated Fortress",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "006",
  text: "FAMILIAR GROUND Characters get +1 {S} while here.\nSAFE HAVEN At the start of your turn, if you have a Pirate character here, gain 1 lore.",
  cost: 2,
  moveCost: 1,
  lore: 0,
  cardNumber: 136,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e456aa982e0a7666b3635ba389f60fac92eb572b",
  },
  abilities: [
    {
      id: "1rj-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "CHARACTERS_HERE",
      },
      name: "FAMILIAR GROUND",
      text: "FAMILIAR GROUND Characters get +1 {S} while here.",
    },
    {
      id: "1rj-2",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a Pirate character here",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
      text: "SAFE HAVEN At the start of your turn, if you have a Pirate character here, gain 1 lore.",
    },
  ],
};
