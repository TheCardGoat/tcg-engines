import type { StageCard } from "@tcg/op-types";
import { op08MobyDick056I18n } from "./056-moby-dick.i18n.ts";

export const op08MobyDick056: StageCard = {
  id: "OP08-056",
  cardType: "stage",
  color: ["blue"],
  rarity: "C",
  setId: "OP08",
  cost: 2,
  traits: ["Whitebeard Pirates"],
  effect:
    '[Your Turn] [Once Per Turn] When your Character with a type including "Whitebeard Piratess" is removed from the field by an effect, draw 1 card. Then, place 1 card from your hand at the top or bottom of your deck. [Trigger] Play this card.',
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
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
      },
    ],
  },
  i18n: op08MobyDick056I18n,
};
