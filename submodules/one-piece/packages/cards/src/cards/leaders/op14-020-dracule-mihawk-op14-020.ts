import type { LeaderCard } from "@tcg/op-types";
import { op14eb04DraculeMihawkOp14020020I18n } from "./op14-020-dracule-mihawk-op14-020.i18n.ts";

export const op14eb04DraculeMihawkOp14020020: LeaderCard = {
  id: "OP14-020",
  canonicalId: "OP14-020",
  slug: "dracule-mihawk-op14-020",
  name: "Dracule Mihawk",
  printings: [
    {
      id: "OP14-020",
      artId: "OP14-020",
      setCode: "OP14",
      collectorNumber: "020",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-020_rldSh09.jpg",
      label: "Dracule Mihawk - OP14-020",
    },
    {
      id: "OP14-020_p1",
      artId: "OP14-020_p1",
      setCode: "OP14",
      collectorNumber: "020",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-020_p1_jDSsWWh.jpg",
      label: "Dracule Mihawk - OP14-020 (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "OP14",
  power: 5000,
  life: 5,
  traits: ["The Seven Warlords of the Sea"],
  attribute: "slash",
  effect:
    'If your opponent\'s Leader has the "Slash" attribute, this leader gains +1000 power.\n[Activate:Main] [Once Per Turn] You may rest 1 of your cards: If there is a Character with a cost of 5 or more, set up to 3 of your DON!! cards as active. Then, you cannot play character cards during this turn.',
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "opponent",
            zone: "leader",
            filters: [{ filter: "attribute", value: "slash" }],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: { player: "self", zones: ["leader"], count: { amount: "all" } },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restCards",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "conditional",
            predicate: {
              condition: "existsOnField",
              zone: "character",
              filters: [{ filter: "cost", comparison: "gte", value: 5 }],
            },
            whenTrue: [
              {
                action: "setActive",
                target: {
                  player: "self",
                  zones: ["costArea"],
                  count: { amount: 3, upTo: true },
                },
              },
            ],
          },
          // "Then, you cannot play character cards" applies after the rest cost
          // regardless of whether a cost-5 Character was present for the DON!! set.
          {
            action: "playRestriction",
            restriction: "cannotPlay",
            filters: [{ filter: "cardCategory", value: "character" }],
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04DraculeMihawkOp14020020I18n,
};
