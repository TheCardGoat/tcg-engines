import type { ActionCard } from "@tcg/lorcana-types";
import { poorUnfortunateSoulsI18n } from "./060-poor-unfortunate-souls.i18n";

export const poorUnfortunateSouls: ActionCard = {
  id: "ysE",
  canonicalId: "ci_smr",
  reprints: ["set4-060", "set9-061"],
  cardType: "action",
  name: "Poor Unfortunate Souls",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 60,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_06c998317b6d45d0abc056cea429ad13",
    tcgPlayer: 650005,
  },
  text: "Return chosen character, item, or location with cost 2 or less to their player's hand.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
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
  i18n: poorUnfortunateSoulsI18n,
};
