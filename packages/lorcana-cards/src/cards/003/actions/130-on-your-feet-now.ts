import type { ActionCard } from "@tcg/lorcana-types";

export const onYourFeetNow: ActionCard = {
  abilities: [
    {
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
      id: "1hc-1",
      text: "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
      type: "action",
    },
  ],
  cardNumber: 130,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "c2489a966a450b41881a99cd9bb1f009bd92d32d",
  },
  franchise: "Peter Pan",
  id: "1hc",
  inkType: ["ruby"],
  inkable: false,
  missingTests: true,
  name: "On Your Feet! Now!",
  set: "003",
  text: "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
};
