import type { ActionCard } from "@tcg/lorcana-types";

export const olympusWouldBeThatWay: ActionCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 3,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "1w0-1",
      text: "Your characters get +3 {S} while challenging a location this turn.",
      type: "static",
    },
  ],
  cardNumber: 197,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "f51fb976aaf3a4c3f2c10e2249bb2ab155b8072b",
  },
  franchise: "Hercules",
  id: "1w0",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Olympus Would Be That Way",
  set: "003",
  text: "Your characters get +3 {S} while challenging a location this turn.",
};
