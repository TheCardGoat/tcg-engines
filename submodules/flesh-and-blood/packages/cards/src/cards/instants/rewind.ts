import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/rewind.generated.ts";

export const rewind = definePitchFamily(fabPitchFamilies["rewind"], {
  abilities: () => ({
    negateTargetNonAttackActionReturnOwnerSHand: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "negate",
            outputBinding: "it",
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["stack"],
              filter: {
                and: [
                  {
                    typeBox: {
                      excludeSubtypes: ["Attack"],
                    },
                  },
                  {
                    typeBox: {
                      types: ["Action"],
                    },
                  },
                ],
              },
              count: 1,
            },
          },
          {
            type: "move-card",
            target: {
              selector: "binding",
              binding: "it",
            },
            to: {
              zone: "hand",
            },
          },
          {
            type: "gain-action-points",
            amount: 1,
            target: "target-controller",
          },
        ],
      },
      label: {
        name: "negate",
      },
    },
  }),
});

export const { blue: rewindBlue } = rewind.cards;
