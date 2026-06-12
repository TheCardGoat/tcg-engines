import type { LeaderCard } from "@tcg/op-types";
import { op14eb04TrafalgarLawOp14001001I18n } from "./001-trafalgar-law-op14-001.i18n.ts";

export const op14eb04TrafalgarLawOp14001001: LeaderCard = {
  id: "OP14-001",
  cardType: "leader",
  color: ["red"],
  rarity: "L",
  setId: "OP14EB04",
  power: 5000,
  life: 5,
  traits: ["Heart Pirates Supernovas The Seven Warlords of the Sea"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-001_p1_TH0mi0Y.jpg",
      imageId: "OP14-001_p1",
    },
  ],
  effect:
    "[Activate:Main] [Once Per Turn] Select 2 of your {Supernovas} or {Heart Pirates} type Characters. Swap the base power of the selected Characters with each other during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "setPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 2,
              },
            },
            value: 0,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04TrafalgarLawOp14001001I18n,
};
