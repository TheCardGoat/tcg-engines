import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/destructive-tendencies.generated.ts";

export const destructiveTendencies = definePitchFamily(fabPitchFamilies["destructive-tendencies"], {
  abilities: () => ({
    chooseModes: modalAbility({
      kind: "modal",
      modal: {
        choose: {
          type: "up-to",
          amount: 2,
        },
      },
      modes: {
        removeAllCountersFromTargetItemToken: {
          kind: "resolution",
          effect: {
            type: "remove-all-counters",
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  metatypes: ["Token"],
                  subtypes: ["Item"],
                },
              },
              count: 1,
            },
            outputBinding: "it",
          },
        },
        removeAllCountersFromTargetAuraToken: {
          kind: "resolution",
          effect: {
            type: "remove-all-counters",
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  metatypes: ["Token"],
                  subtypes: ["Aura"],
                },
              },
              count: 1,
            },
            outputBinding: "it",
          },
        },
      },
    }),
  }),
});

export const { blue: destructiveTendenciesBlue } = destructiveTendencies.cards;
