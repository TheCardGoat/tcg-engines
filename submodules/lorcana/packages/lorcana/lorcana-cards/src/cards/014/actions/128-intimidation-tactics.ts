import type { ActionCard } from "@tcg/lorcana-types";
import { intimidationTacticsI18n } from "./128-intimidation-tactics.i18n";

export const intimidationTactics: ActionCard = {
  id: "zN3",
  canonicalId: "ci_zN3",
  slug: "lorcana-ci_zN3",
  printings: [
    {
      id: "set14-128",
      artId: "set14-128",
      setCode: "set14",
      collectorNumber: "128",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-128"],
  cardType: "action",
  name: "Intimidation Tactics",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "014",
  cardNumber: 128,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_2926bf3cb6f74dc88d9572f3a5cbac85",
  },
  text: "Banish chosen character with 2 {S} or less.",
  abilities: [
    {
      type: "action",
      text: "Banish chosen character with 2 {S} or less.",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "less-or-equal",
              value: 2,
            },
          ],
        },
      },
    },
  ],
  i18n: intimidationTacticsI18n,
};
