import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/benji-the-piercing-wind.generated.ts";

export const benjiThePiercingWind = defineCard(
  fabCardIdentitiesByCanonicalId["HT8r8mg8rHmbWJthCFHfH"],
  {
    abilities: {
      attackAction2LessPowerCantDefendedHand: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "restrict",
          action: "defend",
          subject: attackActionFilter({
            numeric: [
              {
                property: "power",
                basis: "current",
                comparison: { op: "lte", value: 2 },
              },
            ],
          }),
          filter: {
            // Defend-from-hand restriction (not "played onto stack from hand").
            playedFromZones: ["hand"],
          },
          duration: "while-in-arena",
        },
      },
      firstTimeAttackActionHitsTurnNextAttackGains1Power: {
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
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
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
