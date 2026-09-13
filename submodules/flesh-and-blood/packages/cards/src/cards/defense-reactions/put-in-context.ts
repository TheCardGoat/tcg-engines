import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/put-in-context.generated.ts";

export const putInContext = definePitchFamily(fabPitchFamilies["put-in-context"], {
  abilities: () => ({
    restrictDefendedAttackPower: {
      kind: "static",
      staticKind: "continuous",
      functionalZones: ["hand"],
      effect: {
        type: "rule-modification",
        mode: "require",
        action: "play",
        filter: {
          name: "Put in Context",
        },
        duration: "while-condition",
        subject: {
          typeBox: {
            subtypes: ["Attack"],
          },
          numeric: [{ property: "power", basis: "base", comparison: { op: "lte", value: 3 } }],
        },
      },
    },
  }),
});

export const { blue: putInContextBlue } = putInContext.cards;
