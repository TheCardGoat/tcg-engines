import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-energy-matrix.generated.ts";

import { battleworn } from "../shared/keywords.ts";

/**
 * TCC008 Evo Energy Matrix (blue) — Mechanologist Action Evo Chest d2 BW.
 *
 * Printed:
 *   If you have a base chest equipped, transform it into this, then equip this.
 *   Your Teklo Blaster costs {r} less to activate for each opposing hero.
 *   Battleworn
 *
 * Model notes (hand-authored; tekloscope / heartdrive family):
 * - a1 transforms equipped Base+Chest (CR 8.5.36), not self — prior model was
 *   transform self + bare Chest filter (never matched Base).
 * - a2 continuous cost −N on name "Teklo Blaster" where N = opposing heroes.
 *   1v1 product: N=1 so base 3{r} activate becomes 2{r}.
 * - a2 residual label "transform" removed (parser noise).
 */
export const evoEnergyMatrix = definePitchFamily(fabPitchFamilies["evo-energy-matrix"], {
  keywords: [battleworn],
  abilities: () => ({
    ifHaveBaseChestEquippedTransformIntoThenEquip: {
      kind: "resolution",
      // Printed base chest; transform equipped base (CR 8.5.36), not self.
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Base", "Chest"],
          },
        },
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "transform",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["equipment-chest"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                  subtypes: ["Base", "Chest"],
                },
              },
              count: 1,
            },
            into: "this",
          },
          {
            type: "equip",
            target: {
              selector: "self",
            },
          },
        ],
      },
      label: {
        name: "transform",
      },
    },
    tekloBlasterCostsLessActivateEachOpposingHero: {
      kind: "static",
      staticKind: "continuous",
      // 1v1: opposing heroes = 1 → Teklo Blaster activate 3{r} → 2{r}.
      effect: {
        type: "modify-activation-cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "heroes",
          player: "opponent",
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            name: "Teklo Blaster",
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
  }),
});
export const { blue: evoEnergyMatrixBlue } = evoEnergyMatrix.cards;
