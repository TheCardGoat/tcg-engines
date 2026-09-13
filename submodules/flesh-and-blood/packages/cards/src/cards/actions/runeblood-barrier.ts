import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/runeblood-barrier.generated.ts";

export const runebloodBarrier = definePitchFamily(fabPitchFamilies["runeblood-barrier"], {
  abilities: () => ({
    entersArenaCreate4RunechantTokens: {
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
          type: "create-token",
          token: "runechant",
          controller: "controller",
          count: 4,
        },
      },
    },
    dealtDamageInsteadDestroyManyRunechantTokensPrevent1DamageRunechantTokenDestroyedWay: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "dealt-damage",
          target: "hero",
        },
        modification: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "object",
                declared: "on-stack",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  name: "Runechant",
                  typeBox: {
                    metatypes: ["Token"],
                  },
                },
                count: {
                  type: "event-amount",
                },
              },
            },
            {
              type: "prevention",
              preventionKind: "fixed",
              amount: {
                type: "count",
                what: "destroyed-this-way",
                filter: {
                  name: "Runechant",
                },
              },
              duration: "this-turn",
            },
          ],
        },
        duration: "while-in-arena",
      },
    },
    beginningActionPhaseDestroy: {
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
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});

export const { yellow: runebloodBarrierYellow } = runebloodBarrier.cards;
