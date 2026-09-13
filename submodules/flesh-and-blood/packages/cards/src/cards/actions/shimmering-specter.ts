import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shimmering-specter.generated.ts";

const abilities = {
  triggeredEffect: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "leave-arena",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "source",
          selector: "moved-object",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "create-token",
        token: "spectral-shield",
        controller: "controller",
      },
    },
  },
} as const;

export const shimmeringSpecter = definePitchFamily(fabPitchFamilies["shimmering-specter"], {
  abilities: () => abilities,
});

export const {
  red: shimmeringSpecterRed,
  yellow: shimmeringSpecterYellow,
  blue: shimmeringSpecterBlue,
} = shimmeringSpecter.cards;
