import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/short-shrift.generated.ts";

export const shortShrift = definePitchFamily(fabPitchFamilies["short-shrift"], {
  abilities: () => ({
    hasPowerGreaterThanBaseGetsNumber1Power: {
      kind: "resolution",
      condition: {
        type: "object-numeric-comparison",
        property: "power",
        left: "current",
        op: "gt",
        right: "base",
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
    crushAbility: crushAbility({
      effect: {
        type: "discard",
        target: {
          selector: "attack-target",
        },
      },
    }),
  }),
});

export const { yellow: shortShriftYellow } = shortShrift.cards;
