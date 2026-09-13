import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/arcane-twining.generated.ts";

export const arcaneTwining = definePitchFamily(fabPitchFamilies["arcane-twining"], {
  parameters: pitchMap({ red: { damage: 3 }, yellow: { damage: 2 }, blue: { damage: 1 } }),
  abilities: ({ damage }) => ({
    resolutionDealDamageArcane: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: damage,
        target: {
          selector: "object",
          declared: "on-stack",
          player: "any",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
    },
    activatedInstantAmp: {
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
  red: arcaneTwiningRed,
  yellow: arcaneTwiningYellow,
  blue: arcaneTwiningBlue,
} = arcaneTwining.cards;
