import type { ActionCard } from "@tcg/lorcana-types";

export const walkThePlank: ActionCard = {
  id: "gze",
  cardType: "action",
  name: "Walk the Plank!",
  inkType: ["emerald", "steel"],
  franchise: "Peter Pan",
  set: "008",
  text: 'Your Pirate characters gain "{E} — Banish chosen damaged character" this turn.',
  cost: 3,
  cardNumber: 118,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3d359a0a02dc0bf5f086f4d17147df8470c977e0",
  },
  abilities: [],
};
