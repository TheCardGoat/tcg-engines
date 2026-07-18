import type { CharacterCard } from "@tcg/op-types";
import { op10Smoker030I18n } from "./030-smoker.i18n.ts";

export const op10Smoker030: CharacterCard = {
  id: "OP10-030",
  canonicalId: "OP10-030",
  slug: "smoker/op10-030",
  name: "Smoker",
  printings: [
    {
      id: "OP10-030",
      artId: "OP10-030",
      setCode: "OP10",
      collectorNumber: "030",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-030.jpg",
    },
    {
      id: "OP10-030_p1",
      artId: "OP10-030_p1",
      setCode: "OP10",
      collectorNumber: "030",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-030_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP10",
  cost: 5,
  power: 7000,
  traits: ["Navy Punk Hazard"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-030_p1.jpg",
      imageId: "OP10-030_p1",
    },
  ],
  effect:
    "[Banish] (When this card deals damage, the target card is trashed without activating its Trigger.)\n[Activate: Main] Set up to 1 of your DON!! cards as active. Then, you cannot set DON!! cards as active using Character effects during this turn.",
  effects: {
    keywords: ["banish"],
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
          {
            action: "cannotSetDonActive",
            player: "self",
            source: "characterEffects",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op10Smoker030I18n,
};
