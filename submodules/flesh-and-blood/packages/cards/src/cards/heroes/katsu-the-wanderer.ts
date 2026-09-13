import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/katsu-the-wanderer.generated.ts";

export const katsuTheWanderer = defineCard(
  fabCardIdentitiesByCanonicalId["nM8BHGHd9qLGTPgwtWzkJ"],
  {
    abilities: {
      firstTimeAttackActionHitsTurnDiscardCost0SearchDeckComboBanishFaceUpThenShuffleDeckPlayTurn: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
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
              filter: attackActionFilter(),
              bindAs: "it",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            // Same printed line as Young Katsu — Adult health boundary only.
            type: "optional",
            effect: {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                filter: {
                  cost: {
                    op: "eq",
                    value: 0,
                  },
                },
                count: 1,
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "search",
                  zones: ["deck"],
                  filter: {
                    hasKeyword: "combo",
                  },
                  mayFail: true,
                  to: {
                    zone: "banished",
                  },
                  outputBinding: "it",
                },
                {
                  type: "play-card",
                  fromZones: ["banished"],
                  source: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "this-turn",
                },
              ],
            },
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
