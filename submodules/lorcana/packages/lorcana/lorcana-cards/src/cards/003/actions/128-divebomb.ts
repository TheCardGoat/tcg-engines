import type { ActionCard } from "@tcg/lorcana-types";
import { divebombI18n } from "./128-divebomb.i18n";

export const divebomb: ActionCard = {
  id: "lb1",
  canonicalId: "ci_lb1",
  reprints: ["set3-128"],
  cardType: "action",
  name: "Divebomb",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "003",
  cardNumber: 128,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_a4bd827fb4c6497fba686f38a21448ee",
    tcgPlayer: 537755,
  },
  text: "Banish one of your characters with Reckless to banish chosen character with less {S} than that character.",
  abilities: [
    {
      type: "action",
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
              cardTypes: ["character"],
              filter: [
                {
                  type: "has-keyword",
                  keyword: "Reckless",
                },
              ],
            },
          },
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              requireDifferentTargets: true,
              filter: [
                {
                  type: "strength-comparison",
                  comparison: "less",
                  value: "target",
                  compareWithParentsTarget: true,
                },
              ],
            },
          },
        ],
      },
    },
  ],
  i18n: divebombI18n,
};
