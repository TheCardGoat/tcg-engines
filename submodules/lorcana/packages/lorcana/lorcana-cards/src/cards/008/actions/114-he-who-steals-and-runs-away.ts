import type { ActionCard } from "@tcg/lorcana-types";
import { heWhoStealsAndRunsAwayI18n } from "./114-he-who-steals-and-runs-away.i18n";

export const heWhoStealsAndRunsAway: ActionCard = {
  id: "STB",
  canonicalId: "ci_STB",
  reprints: ["set8-114"],
  cardType: "action",
  name: "He Who Steals and Runs Away",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "008",
  cardNumber: 114,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_b575a1f23d864e64841909db44f25221",
    tcgPlayer: 631683,
  },
  text: "Banish chosen item. Draw a card.",
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["item"],
            },
            type: "banish",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "h00-1",
      text: "Banish chosen item. Draw a card.",
      type: "action",
    },
  ],
  i18n: heWhoStealsAndRunsAwayI18n,
};
