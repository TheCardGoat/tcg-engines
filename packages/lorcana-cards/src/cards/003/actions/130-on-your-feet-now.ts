import type { ActionCard } from "@tcg/lorcana-types";

export const onYourFeetNow: ActionCard = {
  id: "1hc",
  cardType: "action",
  name: "On Your Feet! Now!",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "003",
  text: "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
  cost: 4,
  cardNumber: 130,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "c2489a966a450b41881a99cd9bb1f009bd92d32d",
  },
  abilities: [
    {
      id: "1hc-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "sequence",
            steps: [
              {
                type: "ready",
                target: "YOUR_CHARACTERS",
              },
              {
                type: "deal-damage",
                amount: 1,
                target: "CHOSEN_CHARACTER",
              },
            ],
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "this-turn",
          },
        ],
      },
      text: "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
    },
  ],
};
