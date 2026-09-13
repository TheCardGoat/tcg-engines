import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/aetherize.generated.ts";

export const aetherize = definePitchFamily(fabPitchFamilies["aetherize"], {
  abilities: () => ({
    negateTargetInstantCostLess: {
      kind: "resolution",
      effect: {
        type: "negate",
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["stack"],
          filter: {
            and: [
              {
                typeBox: {
                  types: ["Instant"],
                },
              },
              {
                cost: {
                  op: "lte",
                  value: 1,
                },
              },
            ],
          },
          count: 1,
        },
      },
      label: {
        name: "negate",
      },
    },
  }),
});

export const { blue: aetherizeBlue } = aetherize.cards;
