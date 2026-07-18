import type { LeaderCard } from "@tcg/op-types";
import { op12Koala081I18n } from "./081-koala.i18n.ts";

export const op12Koala081: LeaderCard = {
  id: "OP12-081",
  canonicalId: "OP12-081",
  slug: "koala/op12-081",
  name: "Koala",
  printings: [
    {
      id: "OP12-081",
      artId: "OP12-081",
      setCode: "OP12",
      collectorNumber: "081",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-081_t43rOwN.jpg",
    },
    {
      id: "OP12-081_p1",
      artId: "OP12-081_p1",
      setCode: "OP12",
      collectorNumber: "081",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-081_p1_DTPVK4N.jpg",
    },
  ],
  cardType: "leader",
  color: ["black", "yellow"],
  rarity: "L",
  setId: "OP12",
  power: 5000,
  life: 4,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-081_p1_DTPVK4N.jpg",
      imageId: "OP12-081_p1",
    },
  ],
  effect:
    "When this Leader attacks your opponent's Leader, if you have 2 or more Characters with a cost of 8 or more, draw 1 card.\n[Once Per Turn] This effect can be activated when your opponent plays a Character with a base cost of 8 or more, or when your opponent plays a Character using a Character's effect. Your opponent adds 1 card from the top of their Life cards to their hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        eventFilter: {
          targetFilters: [{ filter: "cardCategory", value: "leader" }],
        },
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 2,
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 8,
              },
            ],
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
        trigger: "whenOpponentPlaysCharacter",
        eventFilter: {
          filters: [{ filter: "baseCost", comparison: "gte", value: 8 }],
        },
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
            },
            destination: "hand",
          },
        ],
        oncePerTurn: true,
        oncePerTurnKey: "koala-opponent-character-play",
        optional: true,
      },
      {
        trigger: "whenOpponentPlaysCharacter",
        eventFilter: {
          sourceFilters: [{ filter: "cardCategory", value: "character" }],
          sourceFromZone: "character",
        },
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: { amount: 1 },
            destination: "hand",
          },
        ],
        oncePerTurn: true,
        oncePerTurnKey: "koala-opponent-character-play",
        optional: true,
      },
    ],
  },
  i18n: op12Koala081I18n,
};
