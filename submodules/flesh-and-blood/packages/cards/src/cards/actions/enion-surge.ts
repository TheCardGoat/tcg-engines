import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/enion-surge.generated.ts";
export const enionSurge = definePitchFamily(fabPitchFamilies["enion-surge"], {
  abilities: (_parameter, { pitch }) => ({
    resolutionDealDamageArcane: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 4 - Number(pitch),
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
    },
    resolutionHasStatusDealtDamageOptionalTapCreateTokenLightning: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "this-dealt-damage",
      },
      effect: {
        type: "optional",
        effect: {
          type: "tap",
          target: {
            selector: "controller",
          },
        },
        then: {
          type: "create-token",
          token: "lightning-flow",
          controller: "controller",
        },
      },
    },
  }),
});
export const {
  red: enionSurgeRed,
  yellow: enionSurgeYellow,
  blue: enionSurgeBlue,
} = enionSurge.cards;
