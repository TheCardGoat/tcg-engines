import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/polarus-pulse-ray.generated.ts";
import { fragment } from "../shared/keywords.ts";

const abilities = {
  triggeredFragmentDealDamage: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "fragment",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "source",
          selector: "object",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 1,
        target: {
          selector: "defending-hero",
        },
      },
    },
  },
} as const;

export const polarusPulseRay = definePitchFamily(fabPitchFamilies["polarus-pulse-ray"], {
  keywords: [fragment],
  abilities: () => ({ ...abilities }),
});

export const {
  red: polarusPulseRayRed,
  yellow: polarusPulseRayYellow,
  blue: polarusPulseRayBlue,
} = polarusPulseRay.cards;
