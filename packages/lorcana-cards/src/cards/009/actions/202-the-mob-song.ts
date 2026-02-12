import type { ActionCard } from "@tcg/lorcana-types";

export const theMobSong: ActionCard = {
  abilities: [
    {
      effect: {
        type: "deal-damage",
        amount: 3,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "g30-1",
      text: "Sing Together 10 Deal 3 damage to up to 3 chosen characters and/or locations.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 202,
  cardType: "action",
  cost: 10,
  externalIds: {
    ravensburger: "39f7d10f346a5d4cfce7f3ea92434317a4b05178",
  },
  franchise: "Beauty and the Beast",
  id: "g30",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "The Mob Song",
  set: "009",
  text: "Sing Together 10 Deal 3 damage to up to 3 chosen characters and/or locations.",
};
