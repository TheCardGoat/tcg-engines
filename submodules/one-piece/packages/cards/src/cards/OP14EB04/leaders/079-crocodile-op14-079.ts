import type { LeaderCard } from "@tcg/op-types";
import { op14eb04CrocodileOp14079079I18n } from "./079-crocodile-op14-079.i18n.ts";

export const op14eb04CrocodileOp14079079: LeaderCard = {
  id: "OP14-079",
  canonicalId: "OP14-079",
  slug: "crocodile-op14-079",
  name: "Crocodile - OP14-079",
  printings: [
    {
      id: "OP14-079",
      artId: "OP14-079",
      setCode: "OP14EB04",
      collectorNumber: "079",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-079_V4lR0ci.jpg",
    },
    {
      id: "OP14-079_p1",
      artId: "OP14-079_p1",
      setCode: "OP14EB04",
      collectorNumber: "079",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-079_p1_Vyro8jz.jpg",
    },
  ],
  cardType: "leader",
  color: ["black"],
  rarity: "L",
  setId: "OP14EB04",
  power: 5000,
  life: 5,
  traits: ["The Seven Warlords of the Sea", "Baroque Works"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-079_p1_Vyro8jz.jpg",
      imageId: "OP14-079_p1",
    },
  ],
  effect:
    "All of your opponent's Characters cannot be removed from the field by your effects.\n[Activate: Main] [Once Per Turn] You may K.O. 1 of your Characters with a type including \"Baroque Works\": Give up to 1 of your opponent's Characters -10 cost during this turn. Then, you may trash 2 cards from the top of your deck.",
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "cannotBeRemoved",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: "all" },
            },
            duration: "permanent",
            bySource: "ownEffect",
          },
        ],
      },
    ],
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "koCharacter",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Baroque Works",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -10,
            duration: "thisTurn",
          },
          {
            action: "choice",
            options: [
              [
                {
                  action: "trashFromDeck",
                  player: "self",
                  amount: 2,
                },
              ],
              [],
            ],
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04CrocodileOp14079079I18n,
};
