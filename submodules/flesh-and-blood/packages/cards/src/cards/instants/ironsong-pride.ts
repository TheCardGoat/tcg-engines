import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/ironsong-pride.generated.ts";

export const ironsongPride = definePitchFamily(fabPitchFamilies["ironsong-pride"], {
  abilities: () => ({
    whenEntersArenaPut1CounterTargetSwordControl: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
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
                subtypes: ["Sword"],
              },
            },
            count: 1,
          },
        },
      },
    },
    whenLeavesArenaRemoveAll1CountersFromSwords: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "remove-all-counters",
          counter: {
            kind: "numeric",
            value: 1,
            property: "power",
          },
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Sword"],
              },
            },
            count: {
              type: "all",
            },
          },
        },
      },
    },
    atBeginningEndPhaseIfSwordHasNotHit: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "not",
          condition: { type: "sword-hit-this-turn" },
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
  }),
});

export const { red: ironsongPrideRed } = ironsongPride.cards;
