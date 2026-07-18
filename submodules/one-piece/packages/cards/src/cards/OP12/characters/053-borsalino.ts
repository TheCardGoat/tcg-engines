import type { CharacterCard } from "@tcg/op-types";
import { op12Borsalino053I18n } from "./053-borsalino.i18n.ts";

export const op12Borsalino053: CharacterCard = {
  id: "OP12-053",
  canonicalId: "OP12-053",
  slug: "borsalino/op12-053",
  name: "Borsalino",
  printings: [
    {
      id: "OP12-053",
      artId: "OP12-053",
      setCode: "OP12",
      collectorNumber: "053",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-053_Xp9zuMd.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[Once Per Turn] If this Character would be removed from the field by your opponent's effect, you may trash 1 card from your hand instead.\n[Opponent's Turn] If your Leader has the \"Navy\" type, this Character gains [Blocker] and +1000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "leaderTrait",
            trait: "Navy",
            match: "includes",
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
            duration: "permanent",
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
            duration: "permanent",
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        source: "opponentEffect",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 1,
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: op12Borsalino053I18n,
};
