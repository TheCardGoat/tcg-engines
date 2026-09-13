import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/teklovossen.generated.ts";

export const teklovossen = defineCard(fabCardIdentitiesByCanonicalId["6PPFnJ8tNtPKN6Km7NWpp"], {
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
      // Grant: next Evo played this turn may be played as an instant.
      // Draw-on-play is modeled as a one-shot delayed trigger on that play.
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
});
