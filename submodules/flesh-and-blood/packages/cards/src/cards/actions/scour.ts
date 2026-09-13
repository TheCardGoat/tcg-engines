import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scour.generated.ts";

export const scour = definePitchFamily(fabPitchFamilies["scour"], {
  abilities: () => ({
    destroyXAuraTokensAurasWithCostNumber0ControlledByHeroDeal: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "destroy",
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["permanent"],
              filter: {
                or: [
                  {
                    typeBox: {
                      subtypes: ["Aura"],
                      metatypes: ["Token"],
                    },
                  },
                  {
                    and: [
                      {
                        typeBox: {
                          subtypes: ["Aura"],
                        },
                      },
                      {
                        numeric: [
                          {
                            property: "cost",
                            basis: "base",
                            comparison: {
                              op: "eq",
                              value: 0,
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              count: {
                type: "x",
              },
            },
          },
          {
            type: "deal-damage",
            damageType: "arcane",
            amount: {
              type: "count",
              what: "destroyed-this-way",
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
            },
            target: {
              selector: "attack-target",
            },
          },
        ],
      },
    },
  }),
});

export const { blue: scourBlue } = scour.cards;
