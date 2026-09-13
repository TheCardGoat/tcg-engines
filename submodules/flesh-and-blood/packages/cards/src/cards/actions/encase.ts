import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/encase.generated.ts";

export const encase = definePitchFamily(fabPitchFamilies["encase"], {
  keywords: [fusion("Ice")],
  abilities: () => ({
    deal3ArcaneDamageAnyTargetIfEncaseWas: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            damageType: "arcane",
            amount: 3,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["hero", "permanent"],
              count: 1,
            },
          },
          {
            type: "conditional",
            condition: {
              type: "and",
              conditions: [
                { type: "has-status", status: "fused" },
                { type: "has-status", status: "dealt-damage-to-hero" },
              ],
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "freeze",
                  target: {
                    selector: "hero",
                    who: "target-controller",
                  },
                  duration: "until-start-of-own-next-turn",
                },
                {
                  type: "freeze",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "target-controller",
                    zones: [
                      "equipment-head",
                      "equipment-chest",
                      "equipment-arms",
                      "equipment-legs",
                    ],
                    count: {
                      type: "all",
                    },
                  },
                  duration: "until-start-of-own-next-turn",
                },
              ],
            },
          },
        ],
      },
    },
  }),
});
export const { red: encaseRed } = encase.cards;
