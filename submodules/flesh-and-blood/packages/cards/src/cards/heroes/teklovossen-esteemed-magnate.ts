import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/teklovossen-esteemed-magnate.generated.ts";

export const teklovossenEsteemedMagnate = defineCard(
  fabCardIdentitiesByCanonicalId["ndKnMFtcDt8JmPFD6bfbk"],
  {
    abilities: {
      playEvosBanishedZone: {
        kind: "static",
        staticKind: "play",
        playEffect: {
          role: "permission",
          fromZones: ["banished"],
          filter: {
            typeBox: {
              subtypes: ["Evo"],
            },
          },
        },
      },
      oncePerTurnInstantResourceResourceResourcePlayNextEvoTurnThoughWereInstantDraw: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "instant",
        cost: {
          class: "asset",
          type: "resources",
          amount: 3,
        },
        // Parity with Young EVO008: continuous next-Evo-as-instant grant +
        // one-shot delayed draw when that Evo is played (not optional nest).
        effect: {
          type: "sequence",
          steps: [
            {
              type: "play-card",
              // Timing-only: "as though it were an instant" does not restrict
              // origin. Banished Evos compose with playEvosBanishedZone.
              source: {
                selector: "self",
              },
              appliesTo: {
                next: {
                  typeBox: {
                    subtypes: ["Evo"],
                  },
                },
              },
              duration: "this-turn",
              asType: "instant",
            },
            {
              type: "delayed-trigger",
              trigger: {
                kind: "event",
                event: {
                  name: "play",
                  actor: {
                    kind: "player",
                    player: "ability-controller",
                  },
                  observes: {
                    kind: "event-object",
                    selector: "played-card",
                    relationship: {
                      kind: "controller",
                      player: "ability-controller",
                    },
                    filter: {
                      typeBox: {
                        subtypes: ["Evo"],
                      },
                    },
                  },
                },
              },
              policy: {
                kind: "windowed",
                duration: "this-turn",
                matching: "first",
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "draw",
                  count: 1,
                  player: "controller",
                },
              },
            },
          ],
        },
      },
    },
  },
);
