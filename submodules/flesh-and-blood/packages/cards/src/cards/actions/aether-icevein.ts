import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/aether-icevein.generated.ts";

export const aetherIcevein = definePitchFamily(fabPitchFamilies["aether-icevein"], {
  keywords: [fusion("Ice")],
  abilities: (_parameter, { pitch }) => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            damageType: "arcane",
            amount: 6 - Number(pitch),
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
              type: "unless",
              effect: {
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "target-controller",
                  zones: ["hand"],
                  count: 1,
                },
              },
              escape: {
                type: "pay",
                cost: {
                  class: "asset",
                  type: "resources",
                  amount: 2,
                },
                payer: "target-controller",
              },
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: aetherIceveinRed,
  yellow: aetherIceveinYellow,
  blue: aetherIceveinBlue,
} = aetherIcevein.cards;
