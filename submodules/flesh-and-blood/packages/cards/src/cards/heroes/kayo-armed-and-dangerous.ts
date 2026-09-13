import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/kayo-armed-and-dangerous.generated.ts";

export const kayoArmedAndDangerous = defineCard(
  fabCardIdentitiesByCanonicalId["qdLHRPTdGkw6TjpMjPTW7"],
  {
    abilities: {
      hasOneWeaponZone: {
        kind: "static",
        staticKind: "meta",
        effect: {
          type: "start-game",
          setup: "zone-counts",
          zoneCounts: [
            {
              zone: "weapon",
              count: 1,
            },
          ],
        },
      },
      attackActionGet1PowerAnyZoneOtherThanCombatChain: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: [
              "hand",
              "deck",
              "graveyard",
              "banished",
              "pitch",
              "arsenal",
              "stack",
              "permanent",
            ],
            filter: attackActionFilter(),
            count: {
              type: "all",
            },
          },
          duration: "while-in-arena",
        },
      },
      firstTimeDiscard6MorePowerDuringActionPhasesCreateMightToken: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "discard",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "discarded-card",
              relationship: {
                kind: "any",
              },
              filter: {
                power: {
                  op: "gte",
                  value: 6,
                },
              },
            },
          },
          state: {
            type: "turn-player",
            who: "self",
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "might",
            controller: "controller",
          },
        },
        limit: {
          count: 1,
          per: "turn",
          ordinals: [1],
        },
      },
    },
  },
);
