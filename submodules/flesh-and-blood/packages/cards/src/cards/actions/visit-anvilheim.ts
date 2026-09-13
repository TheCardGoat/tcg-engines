import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/visit-anvilheim.generated.ts";

export const visitAnvilheim = definePitchFamily(fabPitchFamilies["visit-anvilheim"], {
  abilities: () => ({
    removeXNumber1DefenseCountersFromGuardianOffHandHaveEquipped: {
      kind: "resolution",
      effect: {
        type: "remove-counters",
        counter: {
          kind: "numeric",
          value: -1,
          property: "defense",
        },
        count: {
          type: "x",
        },
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
          },
          count: 1,
        },
      },
    },
  }),
});

export const { blue: visitAnvilheimBlue } = visitAnvilheim.cards;
