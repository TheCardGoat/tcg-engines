import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/golden-skywarden.generated.ts";

export const goldenSkywarden = definePitchFamily(fabPitchFamilies["golden-skywarden"], {
  abilities: () => ({
    whenDefendsMayDestroyItemControlIfDoGets: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "repeat",
          until: "declined",
          effect: {
            type: "optional",
            effect: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Item"],
                  },
                },
                count: 1,
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "modify-numeric",
                  property: "defense",
                  op: "add",
                  amount: 1,
                  target: {
                    selector: "self",
                  },
                  duration: "this-turn",
                },
                {
                  // No-else then-branch: repeat-until-declined stops after a
                  // non-Cog item (printed "if a Golden Cog … repeat").
                  type: "conditional",
                  condition: {
                    type: "not",
                    condition: {
                      type: "compare-amount",
                      amount: {
                        type: "count",
                        what: "destroyed-this-way",
                        filter: {
                          name: "Golden Cog",
                        },
                      },
                      comparison: {
                        op: "gte",
                        value: 1,
                      },
                    },
                  },
                  then: {
                    type: "sequence",
                    steps: [],
                  },
                },
                {
                  type: "conditional",
                  condition: {
                    type: "compare-amount",
                    amount: {
                      type: "count",
                      what: "destroyed-this-way",
                      filter: {
                        name: "Golden Cog",
                      },
                    },
                    comparison: {
                      op: "gte",
                      value: 1,
                    },
                  },
                  then: {
                    type: "create-token",
                    token: "gold",
                    controller: "controller",
                  },
                  else: {
                    type: "sequence",
                    steps: [],
                  },
                },
              ],
            },
          },
        },
      },
      label: {
        name: "galvanize",
      },
    },
  }),
});
export const { yellow: goldenSkywardenYellow } = goldenSkywarden.cards;
