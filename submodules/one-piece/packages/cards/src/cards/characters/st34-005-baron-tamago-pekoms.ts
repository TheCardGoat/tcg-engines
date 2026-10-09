import type { CharacterCard } from "@tcg/op-types";
import { st34BaronTamagoPekoms005I18n } from "./st34-005-baron-tamago-pekoms.i18n.ts";
export const st34BaronTamagoPekoms005: CharacterCard = {
  id: "ST34-005",
  canonicalId: "ST34-005",
  slug: "baron-tamago-pekoms/st34-005",
  name: "Baron Tamago & Pekoms",
  printings: [
    {
      id: "ST34-005",
      artId: "ST34-005",
      setCode: "ST34",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST34-005.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST34",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Minks", "Big Mom Pirates"],
  attribute: "strike",
  effect:
    "[When Attacking] DON!! −1: K.O. up to 1 of your opponent's Characters with 2000 base power or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
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
                  filter: "basePower",
                  comparison: "lte",
                  value: 2000,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st34BaronTamagoPekoms005I18n,
};
