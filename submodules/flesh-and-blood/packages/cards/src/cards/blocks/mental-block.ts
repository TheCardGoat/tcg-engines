import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/mental-block.generated.ts";

export const mentalBlock = definePitchFamily(fabPitchFamilies["mental-block"], {
  abilities: () => ({
    discardToPreventAndCreatePonder: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 2,
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
        additionalModification: {
          type: "create-token",
          token: "ponder",
          controller: "controller",
        },
      },
    },
  }),
});

export const { blue: mentalBlockBlue } = mentalBlock.cards;
