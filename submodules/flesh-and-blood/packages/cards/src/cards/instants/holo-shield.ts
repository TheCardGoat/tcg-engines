import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/holo-shield.generated.ts";

export const holoShield = definePitchFamily(fabPitchFamilies["holo-shield"], {
  parameters: pitchMap({
    red: { holoWard: 4 },
    yellow: { holoWard: 3 },
    blue: { holoWard: 2 },
  }),
  keywords: [{ name: "ward", value: { type: "x" } }],
  abilities: ({ holoWard }) => ({
    wardValue: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: {
            name: "ward",
            value: {
              type: "conditional",
              condition: {
                type: "has-counter",
                counter: { kind: "named", name: "holo" },
                target: { selector: "self" },
              },
              then: holoWard,
              else: 1,
            },
          },
        },
        target: { selector: "self" },
        duration: "while-in-arena",
      },
    },
  }),
});

export const {
  red: holoShieldRed,
  yellow: holoShieldYellow,
  blue: holoShieldBlue,
} = holoShield.cards;
