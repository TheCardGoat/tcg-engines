import type { ActionCard } from "@tcg/lorcana-types";
import { launchI18n } from "./164-launch.i18n";

export const launch: ActionCard = {
  id: "Ysg",
  canonicalId: "ci_Ysg",
  reprints: ["set2-164"],
  cardType: "action",
  name: "Launch",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "002",
  cardNumber: 164,
  rarity: "uncommon",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_93883c73ea3d4c269ed099da7f77414b",
    tcgPlayer: 527624,
  },
  text: "Banish chosen item of yours to deal 5 damage to chosen character.",
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["item"],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              amount: 5,
              target: {
                cardTypes: ["character"],
                count: 1,
                owner: "any",
                selector: "chosen",
                zones: ["play"],
              },
              type: "deal-damage",
            },
          },
        ],
      },
      type: "action",
    },
  ],
  i18n: launchI18n,
};
