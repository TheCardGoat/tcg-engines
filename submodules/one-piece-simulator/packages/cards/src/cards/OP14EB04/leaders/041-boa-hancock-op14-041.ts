import type { LeaderCard } from "@tcg/op-types";
import { op14eb04BoaHancockOp14041041I18n } from "./041-boa-hancock-op14-041.i18n.ts";

export const op14eb04BoaHancockOp14041041: LeaderCard = {
  id: "OP14-041",
  cardType: "leader",
  color: ["blue", "yellow"],
  rarity: "L",
  setId: "OP14EB04",
  power: 5000,
  life: 4,
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-041_p1_waNoiMm.jpg",
      imageId: "OP14-041_p1",
    },
  ],
  effect:
    "[Opponent's Turn] When you play a Character, draw 1 card. [DON!!x1] [Once Per Turn] When one of your {Amazon Lily} or {Kuja Pirates} type Characters with 5000 base power or more is K.O.'d add up to 1 card from the top of your opponent's Life cards to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "whenYouPlayCharacter",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "hand",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04BoaHancockOp14041041I18n,
};
