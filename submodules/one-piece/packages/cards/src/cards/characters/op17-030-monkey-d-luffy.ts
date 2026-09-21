import type { CharacterCard } from "@tcg/op-types";
import { op17MonkeyDLuffy030I18n } from "./op17-030-monkey-d-luffy.i18n.ts";

export const op17MonkeyDLuffy030: CharacterCard = {
  id: "OP17-030",
  canonicalId: "OP17-030",
  slug: "monkey-d-luffy/op17-030",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP17-030",
      artId: "OP17-030",
      setCode: "OP17",
      collectorNumber: "030",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-030_NhbNY7D.jpg",
      label: "Monkey.D.Luffy (030)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP17",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["East Blue Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] You may rest 1 of your DON!! cards: This Character gains [Rush] during this turn.\n\n[Activate: Main] [Once Per Turn] If you have 5 or less cards in your hand, set up to 1 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restDon",
            amount: 1,
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
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 5,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op17MonkeyDLuffy030I18n,
};
