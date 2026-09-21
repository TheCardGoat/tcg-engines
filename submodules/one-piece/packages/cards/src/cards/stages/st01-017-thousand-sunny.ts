import type { StageCard } from "@tcg/op-types";
import { printing, strawHat } from "../st01-helpers.ts";
import { st01ThousandSunny017I18n } from "./st01-017-thousand-sunny.i18n.ts";

export const st01ThousandSunny017: StageCard = {
  id: "ST01-017",
  canonicalId: "ST01-017",
  slug: "thousand-sunny/st01-017",
  name: "Thousand Sunny",
  printings: [printing("ST01-017", "C")],
  cardType: "stage",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 2,
  traits: strawHat,
  effect:
    "[Activate: Main] You may rest this Stage: Up to 1 {Straw Hat Crew} type Leader or Character card on your field gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [{ cost: "restThisCard" }],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "trait", value: "Straw Hat Crew", match: "includes" }],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st01ThousandSunny017I18n,
};
