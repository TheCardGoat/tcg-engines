import type { StageCard } from "@tcg/op-types";
import { op07IslandOfWomen058I18n } from "./058-island-of-women.i18n.ts";

export const op07IslandOfWomen058: StageCard = {
  id: "OP07-058",
  cardType: "stage",
  color: ["blue"],
  rarity: "C",
  setId: "OP07",
  cost: 1,
  traits: ["Amazon Lily"],
  effect:
    "[Activate:Main] You may trash 1 card from your hand and rest this Stage: If your Leader has the [Kuja Pirates] type, return up to 1 of your [Amazon Lily] or [Kuja Pirates] type Characters to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Kuja Pirates",
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Amazon Lily",
                },
                {
                  filter: "trait",
                  value: "Kuja Pirates",
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op07IslandOfWomen058I18n,
};
