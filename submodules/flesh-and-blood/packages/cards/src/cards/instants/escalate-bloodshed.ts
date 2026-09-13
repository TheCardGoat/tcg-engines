import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/escalate-bloodshed.generated.ts";

export const escalateBloodshed = definePitchFamily(fabPitchFamilies["escalate-bloodshed"], {
  abilities: () => ({
    wheneverHeroDrawsDuringActionPhaseTheyLose1: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "draw",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
        // Printed "during an action phase": the end-phase draw-up-to-intellect
        // emits the same draw event and must not fire the tax.
        state: { type: "phase-is", phase: "action" },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "lose-life",
          amount: 1,
          target: { selector: "hero", who: { binding: "event-actor" } },
        },
      },
    },
    atBeginningEachHeroSActionPhaseTheyDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: { kind: "any" },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "draw",
          count: 1,
          player: "turn-player",
        },
      },
    },
    atBeginningEachHeroSEndPhaseIfWeapon: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "end-phase",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "compare-amount",
          amount: { type: "count", what: "weapon-attacks-this-turn" },
          comparison: { op: "lt", value: 1 },
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

export const { red: escalateBloodshedRed } = escalateBloodshed.cards;
