import type { EventCard } from "@tcg/op-types";
import { op03SanjiSPilaf056I18n } from "./056-sanji-s-pilaf.i18n.ts";

export const op03SanjiSPilaf056: EventCard = {
  id: "OP03-056",
  canonicalId: "OP03-056",
  slug: "sanji-s-pilaf",
  name: "Sanji's Pilaf",
  printings: [
    {
      id: "OP03-056",
      artId: "OP03-056",
      setCode: "OP03",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-056.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP03",
  cost: 3,
  traits: ["East Blue"],
  effect: "[Main] Draw 2 cards. [Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: op03SanjiSPilaf056I18n,
};
