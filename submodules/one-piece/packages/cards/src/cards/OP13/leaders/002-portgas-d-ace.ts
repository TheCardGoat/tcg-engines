import type { LeaderCard } from "@tcg/op-types";
import { op13PortgasDAce002I18n } from "./002-portgas-d-ace.i18n.ts";

export const op13PortgasDAce002: LeaderCard = {
  id: "OP13-002",
  canonicalId: "OP13-002",
  slug: "portgas-d-ace/op13-002",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "OP13-002",
      artId: "OP13-002",
      setCode: "OP13",
      collectorNumber: "002",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-002_sy67sYO.jpg",
    },
    {
      id: "OP13-002_p1",
      artId: "OP13-002_p1",
      setCode: "OP13",
      collectorNumber: "002",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-002_p1_9XMhMTI.jpg",
    },
  ],
  cardType: "leader",
  color: ["blue", "red"],
  rarity: "L",
  setId: "OP13",
  power: 6000,
  life: 3,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-002_p1_9XMhMTI.jpg",
      imageId: "OP13-002_p1",
    },
  ],
  effect:
    "[On Your Opponent's Attack] [Once Per Turn] You may trash 1 card from your hand: Give up to 1 of your opponent's Leader or Character cards −2000 power during this battle.\n[DON!! x1] [Once Per Turn] When you take damage or your Character with 6000 base power or more is K.O.'d, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisBattle",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
      {
        trigger: "whenYouTakeDamage",
        eventFilter: { targetSelf: true },
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
        oncePerTurnKey: "ace-damage-or-character-ko",
      },
      {
        trigger: "whenCharacterKod",
        eventFilter: {
          player: "self",
          filters: [
            { filter: "cardCategory", value: "character" },
            { filter: "basePower", comparison: "gte", value: 6000 },
          ],
        },
        conditions: [{ condition: "donAttached", amount: 1 }],
        actions: [{ action: "draw", player: "self", amount: 1 }],
        oncePerTurn: true,
        oncePerTurnKey: "ace-damage-or-character-ko",
      },
    ],
  },
  i18n: op13PortgasDAce002I18n,
};
