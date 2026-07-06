import type { ActionCard } from "@tcg/lorcana-types";
import { narrowEscapeI18n } from "./069-narrow-escape.i18n";

export const narrowEscape: ActionCard = {
  id: "vU3",
  canonicalId: "ci_vU3",
  slug: "lorcana-ci_vU3",
  printings: [
    {
      id: "set13-069",
      artId: "set13-069",
      setCode: "set13",
      collectorNumber: "69",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-069"],
  cardType: "action",
  name: "Narrow Escape",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "013",
  cardNumber: 69,
  rarity: "common",
  cost: 4,
  inkable: true,
  text: "Return up to 2 chosen characters, items, or locations with cost 2 or less each to their player's hand.",
  abilities: [
    {
      type: "action",
      text: "Return up to 2 chosen characters, items, or locations with cost 2 or less each to their player's hand.",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: { upTo: 2 },
          owner: "any",
          zones: ["play"],
          cardTypes: ["character", "item", "location"],
          filter: [
            {
              type: "cost-comparison",
              comparison: "less-or-equal",
              value: 2,
            },
          ],
        },
      },
    },
  ],
  i18n: narrowEscapeI18n,
};
