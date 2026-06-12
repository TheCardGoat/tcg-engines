import type { ActionCard } from "@tcg/lorcana-types";
import { healWhatHasBeenHurtI18n } from "./026-heal-what-has-been-hurt.i18n";

export const healWhatHasBeenHurt: ActionCard = {
  id: "qoo",
  canonicalId: "ci_ol7",
  reprints: ["set3-026", "set9-027"],
  cardType: "action",
  name: "Heal What Has Been Hurt",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "003",
  cardNumber: 26,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_d3bdbbdbd842435fa3fa0ac7ec4eb28d",
    tcgPlayer: 649974,
  },
  text: "Remove up to 3 damage from chosen character. Draw a card.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-damage",
            amount: { type: "up-to", value: 3 },
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: healWhatHasBeenHurtI18n,
};
