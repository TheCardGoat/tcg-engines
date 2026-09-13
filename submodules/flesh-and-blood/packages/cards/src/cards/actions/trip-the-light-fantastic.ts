import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/trip-the-light-fantastic.generated.ts";

const abilities = {
  activatedPrevention: {
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
    },
  },
} as const;

export const tripTheLightFantastic = definePitchFamily(
  fabPitchFamilies["trip-the-light-fantastic"],
  {
    abilities: () => abilities,
  },
);

export const {
  red: tripTheLightFantasticRed,
  yellow: tripTheLightFantasticYellow,
  blue: tripTheLightFantasticBlue,
} = tripTheLightFantastic.cards;
