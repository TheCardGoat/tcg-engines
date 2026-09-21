import type { CharacterCard } from "@tcg/op-types";
import { op17Fossa010I18n } from "./op17-010-fossa.i18n.ts";

export const op17Fossa010: CharacterCard = {
  id: "OP17-010",
  canonicalId: "OP17-010",
  slug: "fossa/op17-010",
  name: "Fossa",
  printings: [
    {
      id: "OP17-010",
      artId: "OP17-010",
      setCode: "OP17",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-010_NccB7HH.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP17",
  cost: 1,
  power: 3000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "[Activate: Main] [Once Per Turn] If your opponent has a Character with 10000 power or more and you have no other [Fossa], this Character gains [Blocker] and +2000 power until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "hasCard",
                player: "opponent",
                zone: "character",
                filters: [
                  {
                    filter: "power",
                    comparison: "gte",
                    value: 10000,
                  },
                ],
              },
              {
                condition: "notHasCard",
                player: "self",
                zone: "field",
                filters: [
                  {
                    filter: "excludeSelf",
                  },
                  {
                    filter: "name",
                    value: "Fossa",
                  },
                ],
              },
            ],
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
            keyword: "blocker",
            duration: "untilEndOfOpponentNextEndPhase",
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
            value: 2000,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op17Fossa010I18n,
};
