import type { CharacterCard } from "@tcg/op-types";
import { op11ShanksSp004I18n } from "./st16-004-shanks-sp.i18n.ts";

export const op11ShanksSp004: CharacterCard = {
  id: "ST16-004",
  canonicalId: "ST16-004",
  slug: "shanks-sp/st16-004",
  name: "Shanks",
  printings: [
    {
      id: "ST16-004",
      artId: "ST16-004",
      setCode: "ST16",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-004_p1.jpg",
      label: "Shanks (SP)",
    },
    {
      id: "ST16-004_p2",
      artId: "ST16-004_p2",
      setCode: "ST16",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-004_p2.jpg",
      label: "Shanks - ST16-004 (Alternate Art)",
    },
    {
      id: "ST16-004_r1",
      artId: "ST16-004_r1",
      setCode: "ST16",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-004_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "ST16",
  cost: 9,
  power: 11000,
  traits: ["FILM The Four Emperors Red-Haired Pirates"],
  attribute: "slash",
  effect: "[On Play] K.O. up to 1 of your opponent's rested Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op11ShanksSp004I18n,
};
