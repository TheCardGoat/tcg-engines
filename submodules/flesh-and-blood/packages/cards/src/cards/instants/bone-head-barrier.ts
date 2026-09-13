import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/bone-head-barrier.generated.ts";

export const boneHeadBarrier = definePitchFamily(fabPitchFamilies["bone-head-barrier"], {
  abilities: () => ({
    roll6SidedDiePreventNextXDamageWould: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "roll",
            sides: 6,
          },
          {
            type: "prevention",
            // CR 6.4.10j: "Prevent the next X damage" is a shielding-prevention
            // effect — the remaining amount carries across damage events until
            // exhausted (unlike a one-off fixed prevention).
            preventionKind: "shielding",
            amount: {
              type: "roll-result",
            },
            shielded: {
              selector: "controller",
            },
            duration: "this-turn",
          },
        ],
      },
    },
  }),
});

export const { yellow: boneHeadBarrierYellow } = boneHeadBarrier.cards;
