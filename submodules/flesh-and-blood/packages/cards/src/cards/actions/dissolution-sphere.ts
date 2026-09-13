import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dissolution-sphere.generated.ts";

export const dissolutionSphere = definePitchFamily(fabPitchFamilies["dissolution-sphere"], {
  abilities: () => ({
    dissolutionSphereEntersArenaSteamCounter: {
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
            name: "steam",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    atBeginningActionPhaseDestroyDissolutionSphereUnlessRemove: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "unless",
          effect: {
            type: "destroy",
            target: {
              selector: "self",
            },
          },
          escape: {
            type: "remove-counters",
            counter: {
              kind: "named",
              name: "steam",
            },
            count: 1,
            target: {
              selector: "self",
            },
          },
        },
      },
    },
    wheneverHeroWouldBeDealtExactly1DamagePrevent: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        shielded: {
          selector: "controller",
        },
        incomingDamage: { op: "eq", value: 1 },
        duration: "while-in-arena",
      },
    },
  }),
});
export const { yellow: dissolutionSphereYellow } = dissolutionSphere.cards;
