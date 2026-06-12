import type { StageCard } from "@tcg/op-types";
import { op10PunkHazard021I18n } from "./021-punk-hazard.i18n.ts";

export const op10PunkHazard021: StageCard = {
  id: "OP10-021",
  cardType: "stage",
  color: ["red"],
  rarity: "C",
  setId: "OP10",
  cost: 1,
  traits: ["Punk Hazard"],
  effect:
    "[Activate: Main] You may rest this Stage: If your Leader is [Caesar Clown], give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderName",
            name: "Caesar Clown",
          },
        ],
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10PunkHazard021I18n,
};
