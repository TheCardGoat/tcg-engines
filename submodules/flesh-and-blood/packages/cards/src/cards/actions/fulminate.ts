import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fulminate.generated.ts";

import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const fulminate = definePitchFamily(fabPitchFamilies["fulminate"], {
  keywords: [fusion(["Earth", "Lightning"], "and-or"), goAgain],
  abilities: () => ({
    ifFulminateWasFusedEarthAttackActionControlGain: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused-with-earth-card",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          ...nextAttackActionLatch(),
          count: { type: "all" },
        },
      },
    },
    ifFulminateWasFusedLightningAttackActionControlGain: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused-with-lightning-card",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          ...nextAttackActionLatch(),
          count: { type: "all" },
        },
      },
    },
  }),
});
export const { yellow: fulminateYellow } = fulminate.cards;
