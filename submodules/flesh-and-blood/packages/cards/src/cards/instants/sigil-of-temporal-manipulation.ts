import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/sigil-of-temporal-manipulation.generated.ts";

export const sigilOfTemporalManipulation = definePitchFamily(
  fabPitchFamilies["sigil-of-temporal-manipulation"],
  {
    abilities: () => ({
      atBeginningActionPhaseDestroy: {
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
      whenLeavesArenaBanishTopDeckIfSNon: {
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
            type: "sequence",
            steps: [
              {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["deck"],
                  position: "top",
                  count: 1,
                },
                outputBinding: "it",
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "it",
                  filter: {
                    typeBox: {
                      types: ["Action"],
                      excludeSubtypes: ["Attack"],
                    },
                  },
                },
                then: {
                  type: "optional",
                  effect: {
                    type: "play-card",
                    fromZones: ["banished"],
                    source: {
                      selector: "binding",
                      binding: "it",
                    },
                    duration: "this-turn",
                    asType: "instant",
                  },
                },
              },
            ],
          },
        },
      },
    }),
  },
);

export const { blue: sigilOfTemporalManipulationBlue } = sigilOfTemporalManipulation.cards;
