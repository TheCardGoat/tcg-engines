import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/groundbreaker-crix.generated.ts";

export const groundbreakerCrix = defineCard(
  fabCardIdentitiesByCanonicalId["JzRH98DmhDN98PnGR8bcg"],
  {
    abilities: {
      attacksGet1PowerAttackingWhoControlsSeismicSurgeToken: {
        kind: "static",
        staticKind: "continuous",
        // Structured control-object on defending-hero (not a fabricated has-status).
        // Live combat facts supply defendingPlayerId so the buff applies only while
        // attacking a hero who actually controls Seismic Surge.
        condition: {
          type: "control-object",
          player: "defending-hero",
          filter: {
            name: "Seismic Surge",
          },
        },
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["combat-chain", "stack"],
            filter: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
            count: {
              type: "all",
            },
          },
          duration: "while-in-arena",
        },
      },
      wheneverAttackGuardianClashWinnerCreatesSeismicSurgeToken: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
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
              filter: {
                typeBox: {
                  supertypes: ["Guardian"],
                },
              },
            },
            target: {
              kind: "hero",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "clash",
            with: {
              selector: "attack-target",
            },
            prize: {
              type: "create-token",
              token: "seismic-surge",
              controller: "winner",
            },
          },
        },
        label: {
          name: "clash",
        },
      },
    },
  },
);
