import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sap.generated.ts";

export const sap = definePitchFamily(fabPitchFamilies["sap"], {
  parameters: pitchMap({ red: { damage: 3 }, yellow: { damage: 2 }, blue: { damage: 1 } }),
  abilities: ({ damage }) => ({
    resolutionDealDamage: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: damage,
        target: {
          selector: "any-hero",
        },
      },
    },
    resolutionOptional: {
      kind: "resolution",
      condition: {
        type: "source-damage-dealt",
        per: "turn",
        comparison: { op: "gt", value: damage },
        toHero: true,
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-counters",
          counter: {
            kind: "named",
            name: "energy",
          },
          count: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              name: "A Permanent They Control",
            },
            count: 1,
          },
        },
      },
      label: {
        name: "surge",
      },
    },
  }),
});

export const { red: sapRed, yellow: sapYellow, blue: sapBlue } = sap.cards;
