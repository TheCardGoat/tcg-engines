import type { EventCard } from "@tcg/op-types";
import { op17WoRoRoRoRoIThinkIVeSoberedUp076I18n } from "./op17-076-wo-ro-ro-ro-ro-i-think-i-ve-sobered-up.i18n.ts";

export const op17WoRoRoRoRoIThinkIVeSoberedUp076: EventCard = {
  id: "OP17-076",
  canonicalId: "OP17-076",
  slug: "wo-ro-ro-ro-ro-i-think-i-ve-sobered-up/op17-076",
  name: "Wo Ro Ro Ro Ro... I Think I've Sobered Up",
  printings: [
    {
      id: "OP17-076",
      artId: "OP17-076",
      setCode: "OP17",
      collectorNumber: "076",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-076_Nqb1qKD.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP17",
  cost: 0,
  traits: ["The Four Emperors Animal Kingdom Pirates"],
  effect:
    "[Counter] You may trash 1 card from your hand: Up to 1 of your Leader or Charactes gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        optional: true,
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op17WoRoRoRoRoIThinkIVeSoberedUp076I18n,
};
