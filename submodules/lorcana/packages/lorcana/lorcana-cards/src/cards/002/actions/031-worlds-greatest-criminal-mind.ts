import type { ActionCard } from "@tcg/lorcana-types";
import { worldsGreatestCriminalMindI18n } from "./031-worlds-greatest-criminal-mind.i18n";

export const worldsGreatestCriminalMind: ActionCard = {
  id: "KVh",
  canonicalId: "ci_NsP",
  reprints: ["set2-031", "set9-030"],
  cardType: "action",
  name: "World's Greatest Criminal Mind",
  inkType: ["amber"],
  franchise: "Great Mouse Detective",
  set: "002",
  cardNumber: 31,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_772b7e1de7024e47bdbe47e672f35d2f",
    tcgPlayer: 649977,
  },
  text: "Banish chosen character with 5 {S} or more.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
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
              comparison: "greater-or-equal",
              value: 5,
            },
          ],
        },
      },
    },
  ],
  i18n: worldsGreatestCriminalMindI18n,
};
