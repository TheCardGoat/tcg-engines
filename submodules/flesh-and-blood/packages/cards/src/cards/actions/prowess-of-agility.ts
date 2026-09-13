import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/prowess-of-agility.generated.ts";

export const prowessOfAgility = definePitchFamily(fabPitchFamilies["prowess-of-agility"], {
  abilities: () => ({
    attackFourthTimeDuringTurnDestroyDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
          },
        },
        state: {
          type: "compare-amount",
          amount: { type: "count", what: "attacks-this-turn" },
          comparison: { op: "eq", value: 4 },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "self",
            },
          },
          then: {
            type: "draw",
            count: 1,
            player: "controller",
          },
        },
      },
    },
    beginningEndPhaseAttackedLessThan3TimesTurnDestroy: {
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
          type: "compare-amount",
          amount: { type: "count", what: "attacks-this-turn" },
          comparison: { op: "lt", value: 3 },
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

export const { blue: prowessOfAgilityBlue } = prowessOfAgility.cards;
