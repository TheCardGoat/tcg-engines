import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dissipation-shield.generated.ts";

export const dissipationShield = definePitchFamily(fabPitchFamilies["dissipation-shield"], {
  abilities: () => ({
    dissipationShieldEntersArena4SteamCounters: {
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
          count: 4,
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    atBeginningActionPhaseDestroyDissipationShieldUnlessRemove: {
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
    instantDestroyDissipationShieldNextTimeHeroWouldBe: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: {
          type: "count",
          what: "counters-on-source",
          counter: {
            kind: "named",
            name: "steam",
          },
        },
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { yellow: dissipationShieldYellow } = dissipationShield.cards;
