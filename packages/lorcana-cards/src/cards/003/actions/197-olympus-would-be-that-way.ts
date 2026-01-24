import type { ActionCard } from "@tcg/lorcana-types";

export const olympusWouldBeThatWay: ActionCard = {
  id: "1w0",
  cardType: "action",
  name: "Olympus Would Be That Way",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "003",
  text: "Your characters get +3 {S} while challenging a location this turn.",
  cost: 1,
  cardNumber: 197,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f51fb976aaf3a4c3f2c10e2249bb2ab155b8072b",
  },
  abilities: [
    {
      id: "1w0-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      text: "Your characters get +3 {S} while challenging a location this turn.",
    },
  ],
};
