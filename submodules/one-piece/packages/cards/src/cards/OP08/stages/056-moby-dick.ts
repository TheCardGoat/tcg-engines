import type { StageCard } from "@tcg/op-types";
import { op08MobyDick056I18n } from "./056-moby-dick.i18n.ts";

export const op08MobyDick056: StageCard = {
  id: "OP08-056",
  canonicalId: "OP08-056",
  slug: "moby-dick/op08-056",
  name: "Moby Dick",
  printings: [
    {
      id: "OP08-056",
      artId: "OP08-056",
      setCode: "OP08",
      collectorNumber: "056",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-056.jpg",
    },
  ],
  cardType: "stage",
  color: ["blue"],
  rarity: "C",
  setId: "OP08",
  cost: 2,
  traits: ["Whitebeard Pirates"],
  effect:
    '[Your Turn] [Once Per Turn] When your Character with a type including "Whitebeard Pirates" is removed from the field by an effect, draw 1 card. Then, place 1 card from your hand at the top or bottom of your deck. [Trigger] Play this card.',
  effects: {
    effects: [
      {
        trigger: "whenLeaving",
        eventFilter: {
          player: "self",
          causedBy: "any",
          filters: [
            {
              filter: "trait",
              value: "Whitebeard Pirates",
              match: "includes",
            },
          ],
        },
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
            },
            position: "any",
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op08MobyDick056I18n,
};
