import type { ActionCard } from "@tcg/lorcana-types";
import { onYourFeetNowI18n } from "./130-on-your-feet-now.i18n";

export const onYourFeetNow: ActionCard = {
  id: "luq",
  canonicalId: "ci_luq",
  reprints: ["set3-130"],
  cardType: "action",
  name: "On Your Feet! Now!",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 130,
  rarity: "rare",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_d42f3cca7b9c46a988d81347b0a4ba8b",
    tcgPlayer: 539093,
  },
  text: "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: "YOUR_CHARACTERS",
          },
          {
            type: "deal-damage",
            amount: 1,
            target: "YOUR_CHARACTERS",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "YOUR_CHARACTERS",
            type: "restriction",
          },
        ],
      },
    },
  ],
  i18n: onYourFeetNowI18n,
};
