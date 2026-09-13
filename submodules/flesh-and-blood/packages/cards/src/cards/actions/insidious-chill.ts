import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/insidious-chill.generated.ts";

export const insidiousChill = definePitchFamily(fabPitchFamilies["insidious-chill"], {
  abilities: () => ({
    insidiousChillEntersArena3FrostCounters: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "enter-arena",
          subject: "self",
        },
        modification: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "frost",
          },
          count: 3,
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    noFrostCountersDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "state",
        state: {
          type: "has-counter",
          counter: {
            kind: "named",
            name: "frost",
          },
          target: {
            selector: "self",
          },
          comparison: {
            op: "eq",
            value: 0,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
    wheneverIceFuseRemoveFrostCounterInsidiousChillTargetDiscardsUnlessPayResourceResource: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "fuse",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "fused-card",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Ice"],
              },
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "if-you-do",
          effect: {
            type: "remove-counters",
            counter: {
              kind: "named",
              name: "frost",
            },
            count: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                name: "Insidious Chill",
              },
              count: 1,
            },
          },
          then: {
            type: "unless",
            effect: {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["hand"],
                count: 1,
              },
            },
            escape: {
              type: "pay",
              cost: {
                class: "asset",
                type: "resources",
                amount: 2,
              },
              payer: "opponent",
            },
          },
        },
      },
    },
  }),
});

export const { blue: insidiousChillBlue } = insidiousChill.cards;
