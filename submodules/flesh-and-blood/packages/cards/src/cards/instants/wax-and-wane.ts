import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/wax-and-wane.generated.ts";

export const waxAndWane = definePitchFamily(fabPitchFamilies["wax-and-wane"], {
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
        put1CounterTargetBlueAuraControl: {
          kind: "resolution",
          effect: {
            type: "add-counter",
            counter: {
              kind: "numeric",
              value: 1,
              property: "power",
            },
            count: 1,
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["permanent"],
              filter: {
                and: [
                  {
                    color: ["blue"],
                  },
                  {
                    typeBox: {
                      subtypes: ["Aura"],
                    },
                  },
                ],
              },
              count: 1,
            },
          },
        },
        put1CounterTargetAuraWardControl: {
          kind: "resolution",
          effect: {
            type: "add-counter",
            counter: {
              kind: "numeric",
              value: 1,
              property: "power",
            },
            count: 1,
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
                hasKeyword: "ward",
              },
              count: 1,
            },
          },
        },
      },
    }),
  }),
});

export const { blue: waxAndWaneBlue } = waxAndWane.cards;
