import type { LeaderCard } from "@tcg/op-types";
import { op04NefeltariVivi001I18n } from "./001-nefeltari-vivi.i18n.ts";

export const op04NefeltariVivi001: LeaderCard = {
  id: "OP04-001",
  cardType: "leader",
  color: ["blue", "red"],
  rarity: "L",
  setId: "OP04",
  power: 5000,
  life: 5,
  traits: ["Alabasta"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-001_p1.jpg",
      imageId: "OP04-001_p1",
    },
  ],
  effect:
    "This Leader cannot attack. [Activate:Main] [Once Per Turn] (2) (You may rest the specified number of DON!! cards in your cost area.): Draw 1 card and up to 1 of your Characters gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op04NefeltariVivi001I18n,
};
