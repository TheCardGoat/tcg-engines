import type { LeaderCard } from "@tcg/op-types";
import { op13JewelryBonney100I18n } from "./100-jewelry-bonney.i18n.ts";

export const op13JewelryBonney100: LeaderCard = {
  id: "OP13-100",
  cardType: "leader",
  color: ["yellow"],
  rarity: "L",
  setId: "OP13",
  power: 5000,
  life: 5,
  traits: ["Bonney Pirates Egghead"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-100_p1_IzreIOG.jpg",
      imageId: "OP13-100_p1",
    },
  ],
  effect:
    "[Your Turn] [Once Per Turn] This effect can be activated when you play a Character with a [Trigger]. Give up to 2 rested DON!! cards to 1 of your Leader or Character cards.",
  effects: {
    effects: [
      {
        trigger: "whenTriggerCharacterPlayed",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
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
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op13JewelryBonney100I18n,
};
