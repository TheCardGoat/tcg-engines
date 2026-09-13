import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fault-line.generated.ts";

import { crushAbility } from "@tcg/flesh-and-blood-types";

export const faultLine = definePitchFamily(fabPitchFamilies["fault-line"], {
  abilities: () => ({
    ifHaveArsenalGets1: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "arsenal",
        player: "controller",
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
    crushBottomAllArsenals: crushAbility({
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "each",
          zones: ["arsenal"],
          count: {
            type: "all",
          },
        },
        to: {
          zone: "deck",
          position: "bottom",
        },
      },
    }),
  }),
});
export const { red: faultLineRed } = faultLine.cards;
