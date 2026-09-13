import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ripple-away.generated.ts";

export const rippleAway = definePitchFamily(fabPitchFamilies["ripple-away"], {
  abilities: () => ({
    instantDiscardActionEffectCreate1MoreTokensTurnInsteadCreatesManyMinus1Tokens: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "create",
          subject: {
            typeBox: {
              types: ["Action"],
            },
          },
        },
        modification: {
          type: "modify-numeric",
          property: "count",
          op: "subtract",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: rippleAwayBlue } = rippleAway.cards;
