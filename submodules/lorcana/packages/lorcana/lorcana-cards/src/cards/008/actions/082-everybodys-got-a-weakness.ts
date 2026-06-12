import type { ActionCard } from "@tcg/lorcana-types";
import { everybodysGotAWeaknessI18n } from "./082-everybodys-got-a-weakness.i18n";

export const everybodysGotAWeakness: ActionCard = {
  id: "Gps",
  canonicalId: "ci_Gps",
  reprints: ["set8-082"],
  cardType: "action",
  name: "Everybody's Got a Weakness",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "008",
  cardNumber: 82,
  rarity: "rare",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_af2675aaffe94ff2bf54e5635e2657d8",
    tcgPlayer: 631832,
  },
  text: "Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-damage",
            amount: 1,
            distribution: "from-each-source",
            from: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "status",
                  status: "damaged",
                },
              ],
            },
            to: "CHOSEN_OPPOSING_CHARACTER",
          },
          {
            type: "draw",
            amount: "DAMAGE_REMOVED",
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: everybodysGotAWeaknessI18n,
};
