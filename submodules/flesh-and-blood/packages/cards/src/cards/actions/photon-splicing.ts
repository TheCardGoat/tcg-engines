import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/photon-splicing.generated.ts";

export const photonSplicing = definePitchFamily(fabPitchFamilies["photon-splicing"], {
  parameters: { red: { damage: 4 }, yellow: { damage: 3 }, blue: { damage: 2 } },
  abilities: ({ damage }) => ({
    dealDamage: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: damage,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
    },
    instantDiscardSelfAmp: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "amp",
        amount: 1,
      },
    },
  }),
});

export const {
  red: photonSplicingRed,
  yellow: photonSplicingYellow,
  blue: photonSplicingBlue,
} = photonSplicing.cards;
