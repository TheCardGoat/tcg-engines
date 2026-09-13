import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/skywarden-no-161803.generated.ts";

export const skywardenNo161803 = definePitchFamily(fabPitchFamilies["skywarden-no-161803"], {
  abilities: () => ({
    whenDefendsDestroyItemControlDoGetsNumber1DefenseGoldenCogDestroyed: {
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
              },
            ],
          },
        },
      },
      label: {
        name: "galvanize",
      },
    },
  }),
});

export const { yellow: skywardenNo161803Yellow } = skywardenNo161803.cards;
