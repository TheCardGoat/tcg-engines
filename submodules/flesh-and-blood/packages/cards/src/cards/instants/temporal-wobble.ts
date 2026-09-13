import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/temporal-wobble.generated.ts";

export const temporalWobble = definePitchFamily(fabPitchFamilies["temporal-wobble"], {
  abilities: () => ({
    negateTargetNonAttackActionCostLessThanNumber: {
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
                      types: ["Action"],
                      excludeSubtypes: ["Attack"],
                    },
                  },
                  {
                    cost: {
                      op: "lt",
                      value: {
                        type: "count",
                        what: "cards-in-zone",
                        zone: "permanent",
                        player: "controller",
                        filter: {
                          and: [
                            {
                              typeBox: {
                                subtypes: ["Aura"],
                              },
                            },
                            {
                              nameContains: "Sigil",
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
              },
              count: 1,
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

export const { red: temporalWobbleRed } = temporalWobble.cards;
