import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/dampen.generated.ts";
export const dampen = definePitchFamily(fabPitchFamilies["dampen"], {
  parameters: pitchMap({ red: { damage: 4 }, yellow: { damage: 3 }, blue: { damage: 2 } }),
  abilities: ({ damage }) => ({
    resolutionDealDamageArcane: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: damage,
        // Printed "any target" must scan both seats (not controller-only default).
        target: {
          selector: "object",
          declared: "on-stack",
          player: "any",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
    },
    resolutionPreventionArcane: {
      kind: "resolution",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: {
          type: "count",
          what: "damage-dealt",
          per: "turn",
          filter: {
            name: "Dampen",
          },
        },
        damageType: "arcane",
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { red: dampenRed, yellow: dampenYellow, blue: dampenBlue } = dampen.cards;
