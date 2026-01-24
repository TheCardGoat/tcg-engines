import type { ActionCard } from "@tcg/lorcana-types";

export const theMobSong: ActionCard = {
  id: "g30",
  cardType: "action",
  name: "The Mob Song",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "Sing Together 10 Deal 3 damage to up to 3 chosen characters and/or locations.",
  actionSubtype: "song",
  cost: 10,
  cardNumber: 202,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "39f7d10f346a5d4cfce7f3ea92434317a4b05178",
  },
  abilities: [
    {
      id: "g30-1",
      type: "action",
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
      text: "Sing Together 10 Deal 3 damage to up to 3 chosen characters and/or locations.",
    },
  ],
};
