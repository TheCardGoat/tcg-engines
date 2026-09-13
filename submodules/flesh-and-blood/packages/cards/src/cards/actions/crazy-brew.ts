import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/crazy-brew.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const crazyBrew = definePitchFamily(fabPitchFamilies["crazy-brew"], {
  abilities: () => ({
    actionDestroyRoll6SidedDie12Lose: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "roll",
            sides: 6,
          },
          {
            type: "conditional",
            condition: {
              type: "die-result",
              comparison: {
                op: "lte",
                value: 2,
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "lose-life",
                  amount: 2,
                  target: {
                    selector: "controller",
                  },
                },
                {
                  type: "grant-property",
                  property: {
                    kind: "keyword",
                    keyword: goAgain,
                  },
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
                },
              ],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "and",
              conditions: [
                {
                  type: "die-result",
                  comparison: {
                    op: "gte",
                    value: 3,
                  },
                },
                {
                  type: "die-result",
                  comparison: {
                    op: "lte",
                    value: 4,
                  },
                },
              ],
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "gain-life",
                  amount: 2,
                  target: {
                    selector: "controller",
                  },
                },
                {
                  type: "grant-property",
                  property: {
                    kind: "keyword",
                    keyword: goAgain,
                  },
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
                },
              ],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "die-result",
              comparison: {
                op: "gte",
                value: 5,
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "gain-resources",
                  amount: 2,
                },
                {
                  type: "gain-action-points",
                  amount: 2,
                },
                {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: 2,
                  target: {
                    selector: "this-attack",
                  },
                  duration: "this-turn",
                  appliesTo: {
                    next: {
                      typeBox: {
                        subtypes: ["Attack"],
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  }),
});
export const { blue: crazyBrewBlue } = crazyBrew.cards;
