import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/shiyana-diamond-gemini.generated.ts";

export const shiyanaDiamondGemini = defineCard(
  fabCardIdentitiesByCanonicalId["n9r77QwMzdWJmnfhPLN9J"],
  {
    abilities: {
      specializationAnyDeck: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "allow",
          action: "have-in-deck",
          filter: {
            hasStatus: "deckbuilding-exception",
          },
          duration: "permanent",
        },
      },
      beginningActionPhaseShiyanaBecomesCopyTargetStartNextTurnGainsClassAdditionOtherClassTypes: {
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
            type: "sequence",
            steps: [
              {
                type: "copy",
                target: {
                  selector: "self",
                },
                source: {
                  selector: "object",
                  declared: "at-resolution",
                  // Printed "target hero" — any seat (including self).
                  player: "any",
                  zones: ["hero"],
                  count: 1,
                },
                duration: "until-start-of-own-next-turn",
              },
              {
                type: "grant-property",
                property: {
                  kind: "ability",
                  ability: {
                    id: "classAdditionOtherClassTypes",
                    text: "",
                    kind: "static",
                    staticKind: "continuous",
                    effect: {
                      type: "grant-property",
                      property: {
                        kind: "supertype",
                        value: "hero-class",
                      },
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "controller",
                        zones: [
                          "hand",
                          "deck",
                          "graveyard",
                          "banished",
                          "permanent",
                          "arsenal",
                          "stack",
                        ],
                        count: {
                          type: "all",
                        },
                      },
                      duration: "while-condition",
                    },
                  },
                },
                target: {
                  selector: "self",
                },
                duration: "until-start-of-own-next-turn",
              },
            ],
          },
        },
      },
    },
  },
);
