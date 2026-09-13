import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-tekloscope.generated.ts";

import { battleworn } from "../shared/keywords.ts";

export const evoTekloscope = definePitchFamily(fabPitchFamilies["evo-tekloscope"], {
  keywords: [battleworn],
  abilities: () => ({
    ifHaveBaseHeadEquippedTransformIntoThenEquip: {
      kind: "resolution",
      // Printed base head; transform equipped base (CR 8.5.36), not self.
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Base", "Head"],
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
              zones: ["equipment-head"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                  subtypes: ["Base", "Head"],
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
    tekloBlasterAttacksCanTargetAnyOpposingHero: {
      kind: "static",
      staticKind: "continuous",
      // 1v1 product: sole opposing seat is the only candidate; multi-opponent
      // targeting is out of scope (boundary note, not multi-seat harness).
      effect: {
        type: "rule-modification",
        mode: "allow",
        action: "attack-target",
        target: "any-opposing-hero",
        filter: {
          name: "Teklo Blaster",
        },
        duration: "while-in-arena",
      },
    },
  }),
});
export const { blue: evoTekloscopeBlue } = evoTekloscope.cards;
