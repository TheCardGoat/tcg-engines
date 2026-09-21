import type { CharacterCard } from "@tcg/op-types";
import { eb04MonkeyDLuffy061I18n } from "./eb04-061-monkey-d-luffy.i18n.ts";

export const eb04MonkeyDLuffy061: CharacterCard = {
  id: "EB04-061",
  canonicalId: "EB04-061",
  slug: "monkey-d-luffy/eb04-061",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "EB04-061",
      artId: "EB04-061",
      setCode: "EB04",
      collectorNumber: "061",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-061_I3Eac0j.jpg",
      label: "Monkey.D.Luffy (EB04-061)",
    },
    {
      id: "EB04-061_p1",
      artId: "EB04-061_p1",
      setCode: "EB04",
      collectorNumber: "061",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-061_p1_LGDNc70.jpg",
      label: "Monkey.D.Luffy (EB04-061) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SEC",
  setId: "EB04",
  cost: 10,
  power: 12000,
  traits: ["Straw Hat Crew The Four Emperors Egghead"],
  attribute: "strike",
  effect:
    "If you have 1 or less Life cards, give this card in your hand -1 cost.\n[On Play] You may trash 1 card from your hand: Your Leader gains +2000 power until the end of your opponent's next End Phase. Then, this Character gains [Blocker] until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 2000,
            duration: "untilEndOfOpponentNextEndPhase",
          },
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
            keyword: "blocker",
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 1,
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: -1,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: eb04MonkeyDLuffy061I18n,
};
