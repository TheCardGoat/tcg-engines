import type { StageCard } from "@tcg/op-types";
import { eb01Loguetown030I18n } from "./030-loguetown.i18n.ts";

export const eb01Loguetown030: StageCard = {
  id: "EB01-030",
  canonicalId: "EB01-030",
  slug: "loguetown",
  name: "Loguetown",
  printings: [
    {
      id: "EB01-030",
      artId: "EB01-030",
      setCode: "EB01",
      collectorNumber: "030",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-030.jpg",
    },
  ],
  cardType: "stage",
  color: ["blue"],
  rarity: "C",
  setId: "EB01",
  cost: 2,
  traits: ["East Blue"],
  effect:
    "[Activate:Main] You may place this card and 1 card from your hand at the bottom of your deck in any order: Draw 2 cards.[Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnThisAndHandToDeck",
            handAmount: 1,
            position: "bottom",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: eb01Loguetown030I18n,
};
