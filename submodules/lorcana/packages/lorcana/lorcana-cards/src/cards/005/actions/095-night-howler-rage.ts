import type { ActionCard } from "@tcg/lorcana-types";
import { nightHowlerRageI18n } from "./095-night-howler-rage.i18n";

export const nightHowlerRage: ActionCard = {
  id: "38h",
  canonicalId: "ci_38h",
  reprints: ["set5-095"],
  cardType: "action",
  name: "Night Howler Rage",
  inkType: ["emerald"],
  franchise: "Zootropolis",
  set: "005",
  cardNumber: 95,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_4fc312f6a56240dba9cb3c6fc6efecde",
    tcgPlayer: 560541,
  },
  text: "Draw a card. Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            duration: "their-next-turn",
            keyword: "Reckless",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "gain-keyword",
          },
        ],
        type: "sequence",
      },
      id: "1mw-1",
      text: "Draw a card. Chosen character gains Reckless during their next turn.",
      type: "action",
    },
  ],
  i18n: nightHowlerRageI18n,
};
