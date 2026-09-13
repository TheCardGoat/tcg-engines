import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/glide-through-starlight.generated.ts";
const abilities = {
  createTokenLightningFlowActivation: {
    kind: "activated",
    abilityType: "instant",
    cost: {
      class: "mixed",
      type: "all",
      costs: [
        {
          class: "asset",
          type: "resources",
          amount: 1,
        },
        {
          class: "effect",
          type: "discard-self",
        },
      ],
    },
    effect: {
      type: "prevention",
      preventionKind: "fixed",
      amount: 1,
      times: 1,
      shielded: {
        selector: "controller",
      },
      duration: "this-turn",
      additionalModification: {
        type: "create-token",
        token: "lightning-flow",
        controller: "controller",
      },
    },
  },
} as const;
export const glideThroughStarlight = definePitchFamily(
  fabPitchFamilies["glide-through-starlight"],
  {
    abilities: () => ({ ...abilities }),
  },
);
export const {
  red: glideThroughStarlightRed,
  yellow: glideThroughStarlightYellow,
  blue: glideThroughStarlightBlue,
} = glideThroughStarlight.cards;
