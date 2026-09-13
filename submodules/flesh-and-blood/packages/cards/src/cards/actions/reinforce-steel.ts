import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/reinforce-steel.generated.ts";

export const reinforceSteel = definePitchFamily(fabPitchFamilies["reinforce-steel"], {
  parameters: { red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } },
  abilities: ({ value1 }) => ({
    removeCountersDefense: {
      kind: "resolution",
      effect: {
        type: "remove-counters",
        counter: {
          kind: "numeric",
          value: -1,
          property: "defense",
        },
        count: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["weapon"],
          filter: {
            typeBox: {
              supertypes: ["Guardian"],
              subtypes: ["Off-Hand"],
            },
            numeric: [
              {
                property: "defense",
                basis: "base",
                comparison: { op: "lte", value: value1 },
              },
            ],
          },
          count: 1,
        },
      },
    },
  }),
});

export const {
  red: reinforceSteelRed,
  yellow: reinforceSteelYellow,
  blue: reinforceSteelBlue,
} = reinforceSteel.cards;
