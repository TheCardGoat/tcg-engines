import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/sunkwater-pincers.generated.ts";

/**
 * MPG116 Sunkwater Pincers — Generic Arms d0 Blade Break.
 *
 * Printed:
 *   When this defends, put a face-up card from your arsenal on the bottom of
 *   your deck. If you do, draw a card and this gets +1{d} until end of turn.
 *   Blade Break
 *
 * Model notes (hand-authored; arms twin of MPG115 Sunkwater Exoshell):
 * - Trigger subject:self so co-defenders do not fire (was bare defend).
 * - move-card arsenal face-up → deck bottom; then (if you do) draw + +1{d} UEOT.
 * - Blade Break d0 independent lifecycle after defend.
 */
export const sunkwaterPincers = defineCard(
  fabCardIdentitiesByCanonicalId["qBMWrpjH8JGrk6Tw7FrHL"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsPutFaceUpFromArsenalBottomDeck: {
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
            type: "if-you-do",
            effect: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["arsenal"],
                filter: {
                  hasStatus: "face-up",
                },
                count: 1,
              },
              to: {
                zone: "deck",
                position: "bottom",
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "draw",
                  count: 1,
                  player: "controller",
                },
                {
                  type: "modify-numeric",
                  property: "defense",
                  op: "add",
                  amount: 1,
                  target: {
                    selector: "self",
                  },
                  duration: "this-turn",
                },
              ],
            },
          },
        },
      },
    },
  },
);
