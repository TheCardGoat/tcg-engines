import type { ActionCard } from "@tcg/lorcana-types";
import { toWitherAFlowerI18n } from "./101-to-wither-a-flower.i18n";

export const toWitherAFlower: ActionCard = {
  id: "ib5",
  canonicalId: "ci_ib5",
  slug: "lorcana-ci_ib5",
  printings: [
    {
      id: "set13-101",
      artId: "set13-101",
      setCode: "set13",
      collectorNumber: "101",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-101"],
  cardType: "action",
  name: "To Wither a Flower",
  inkType: ["emerald"],
  franchise: "Sword in the Stone",
  set: "013",
  cardNumber: 101,
  rarity: "rare",
  cost: 4,
  inkable: false,
  text: "Deal 2 damage to each opposing damaged character.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "status",
              status: "damaged",
            },
          ],
        },
      },
    },
  ],
  i18n: toWitherAFlowerI18n,
};
