import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bracers-of-bellona-s-grace.generated.ts";

/**
 * ASB005 Bracers of Bellona's Grace — Light Warrior Arms d2 Blade Break.
 *
 * Printed:
 *   When this defends, you may charge your hero's soul. If a yellow card is
 *   charged this way, create a Courage token.
 *   Blade Break
 *
 * Model notes (hand-authored; sibling ASB003 helm-of-halo-s-grace):
 * - defend subject:self so co-defenders do not arm this (prior bare defend).
 * - Charge picks a hand card at-resolution (prior selector:controller never
 *   offered a card choice — yellow-charged-this-way was dead).
 * - yellow-charged-this-way from chargedCard / string flag after charge.
 * - Yellow → Courage under controller; non-yellow / decline → no token.
 */
export const bracersOfBellonaSGrace = defineCard(
  fabCardIdentitiesByCanonicalId["Kkh8t7dFfWtf7WBRJWNNJ"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsMayChargeHeroSSoulIfYellow: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "optional",
                effect: {
                  type: "charge",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["hand"],
                    count: 1,
                  },
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "chargedCard",
                  filter: { color: ["yellow"] },
                },
                then: {
                  type: "create-token",
                  token: "courage",
                  controller: "controller",
                },
              },
            ],
          },
        },
        label: {
          name: "charge",
        },
      },
    },
  },
);
