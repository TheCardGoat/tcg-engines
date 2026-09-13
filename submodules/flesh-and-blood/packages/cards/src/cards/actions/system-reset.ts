import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/system-reset.generated.ts";

export const systemReset = definePitchFamily(fabPitchFamilies["system-reset"], {
  abilities: () => ({
    banishXMechanologistItemsControlWithCostNumber0Number1ReturnThemArena: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  supertypes: ["Mechanologist"],
                  subtypes: ["Item"],
                },
                cost: {
                  op: "lte",
                  value: 1,
                },
              },
              count: {
                type: "x",
              },
            },
            outputBinding: "them",
          },
          {
            type: "move-card",
            target: {
              selector: "binding",
              binding: "them",
            },
            to: {
              zone: "permanent",
              player: "owner",
            },
          },
        ],
      },
    },
  }),
});

export const { yellow: systemResetYellow } = systemReset.cards;
