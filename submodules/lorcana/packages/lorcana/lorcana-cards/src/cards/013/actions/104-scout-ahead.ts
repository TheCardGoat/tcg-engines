import type { ActionCard } from "@tcg/lorcana-types";
import { scoutAheadI18n } from "./104-scout-ahead.i18n";

export const scoutAhead: ActionCard = {
  id: "11v",
  canonicalId: "ci_11v",
  slug: "lorcana-ci_11v",
  printings: [
    {
      id: "set13-104",
      artId: "set13-104",
      setCode: "set13",
      collectorNumber: "104",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-104"],
  cardType: "action",
  name: "Scout Ahead",
  inkType: ["emerald"],
  set: "013",
  cardNumber: 104,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7e4498c77e4a448b816dc9a6b6780139",
  },
  text: "If an opponent has more lore than you, gain 2 lore.",
  abilities: [
    {
      type: "action",
      text: "If an opponent has more lore than you, gain 2 lore.",
      effect: {
        type: "conditional",
        condition: {
          type: "comparison",
          left: {
            type: "lore",
            controller: "opponent",
          },
          comparison: "greater",
          right: {
            type: "lore",
            controller: "you",
          },
        },
        then: {
          type: "gain-lore",
          amount: 2,
          target: "CONTROLLER",
        },
      },
    },
  ],
  i18n: scoutAheadI18n,
};
