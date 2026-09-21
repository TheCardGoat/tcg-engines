import type { CharacterCard } from "@tcg/op-types";
import { op15MonkeyDLuffy119I18n } from "./op15-119-monkey-d-luffy.i18n.ts";

export const op15MonkeyDLuffy119: CharacterCard = {
  id: "OP15-119",
  canonicalId: "OP15-119",
  slug: "monkey-d-luffy/op15-119",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP15-119",
      artId: "OP15-119",
      setCode: "OP15",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-119_Bs2LYY4.jpg",
      label: "Monkey.D.Luffy (OP15-119)",
    },
    {
      id: "OP15-119_p1",
      artId: "OP15-119_p1",
      setCode: "OP15",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-119_p1_2faHRBb.jpg",
      label: "Monkey.D.Luffy (OP15-119) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SEC",
  setId: "OP15",
  cost: 5,
  power: 7000,
  traits: ["Straw Hat Crew Sky Island"],
  attribute: "strike",
  effect:
    "If you have 6 or more DON!! cards on your field, this Character gains [Rush].\nWhen your opponent activates an Event or [Blocker], reveal up to 1 card from the top of your Life cards. This Character gains +1000 power during this turn per 1 cost on the revealed card.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenOpponentActivatesEvent",
        actions: [
          {
            action: "revealFromLife",
            player: "self",
            upTo: true,
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            valuePerPreviousActionTargetCost: true,
            previousActionTargets: true,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "whenBlockerActivated",
        eventFilter: {
          causedBy: "opponent",
        },
        actions: [
          {
            action: "revealFromLife",
            player: "self",
            upTo: true,
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            valuePerPreviousActionTargetCost: true,
            previousActionTargets: true,
            duration: "thisTurn",
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 6,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op15MonkeyDLuffy119I18n,
};
