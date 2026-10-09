import type { CharacterCard } from "@tcg/op-types";
import { st23Yasopp005I18n } from "./st23-005-yasopp.i18n.ts";
export const st23Yasopp005: CharacterCard = {
  id: "ST23-005",
  canonicalId: "ST23-005",
  slug: "yasopp/st23-005",
  name: "Yasopp",
  printings: [
    {
      id: "ST23-005",
      artId: "ST23-005",
      setCode: "ST23",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST23-005.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST23",
  cost: 1,
  traits: ["Red-Haired Pirates"],
  power: 1000,
  attribute: "ranged",
  counter: 1000,
  effect:
    "[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: st23Yasopp005I18n,
};
