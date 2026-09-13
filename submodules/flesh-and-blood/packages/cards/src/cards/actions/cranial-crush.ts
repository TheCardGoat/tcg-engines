import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cranial-crush.generated.ts";

import { crushAbility } from "@tcg/flesh-and-blood-types";

/** Model notes: can't-draw applies only during the damaged hero's next action phase. */
export const cranialCrush = definePitchFamily(fabPitchFamilies["cranial-crush"], {
  abilities: () => ({
    crushRestrictDrawNextActionPhase: crushAbility({
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "draw",
        subject: {
          selector: "attack-target",
        },
        duration: "during-their-next-action-phase",
      },
    }),
  }),
});
export const { blue: cranialCrushBlue } = cranialCrush.cards;
