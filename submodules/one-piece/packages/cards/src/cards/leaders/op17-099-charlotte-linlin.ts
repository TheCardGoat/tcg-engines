import type { LeaderCard } from "@tcg/op-types";
import { op17CharlotteLinlin099I18n } from "./op17-099-charlotte-linlin.i18n.ts";

export const op17CharlotteLinlin099: LeaderCard = {
  id: "OP17-099",
  canonicalId: "OP17-099",
  slug: "charlotte-linlin/op17-099",
  name: "Charlotte Linlin",
  printings: [
    {
      id: "OP17-099",
      artId: "OP17-099",
      setCode: "OP17",
      collectorNumber: "099",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-099_F2x3zrl.jpg",
      label: "Charlotte Linlin (099)",
    },
    {
      id: "OP17-099_p1",
      artId: "OP17-099_p1",
      setCode: "OP17",
      collectorNumber: "099",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-099_p1_h6EzGsn.jpg",
      label: "Charlotte Linlin (099) (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["yellow"],
  rarity: "L",
  setId: "OP17",
  power: 5000,
  life: 5,
  traits: ["The Four Emperors Big Mom Pirates"],
  attribute: "special",
  effect:
    "[When Attacking] You may trash 1 card from your hand:\nYour opponent chooses one:\n• Trash 1 card from your hand. Then, add up to 1 card from the top of your deck to the top of your Life cards.\n• Trash 1 card from your opponent's hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        optional: true,
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "choice",
            player: "opponent",
            options: [
              [
                {
                  action: "trashFromHand",
                  player: "self",
                  amount: 1,
                },
                {
                  action: "addToLife",
                  target: {
                    player: "self",
                    zones: ["deck"],
                    count: { amount: 1, upTo: true },
                  },
                  position: "top",
                },
              ],
              [
                {
                  action: "trashFromHand",
                  player: "opponent",
                  amount: 1,
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: op17CharlotteLinlin099I18n,
};
