import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/blood-splattered-vest.generated.ts";

/**
 * HNT168 Blood Splattered Vest — Assassin/Ninja Chest d1 Blade Break.
 *
 * Printed:
 *   Whenever a dagger you control hits, you may gain {r} and put a stain
 *   counter on this. Then if there are 3 or more stain counters on this,
 *   destroy it.
 *   Blade Break
 *
 * Model notes (hand-authored):
 * - Prior model put stain on binding "it" (the dagger) and destroyed the dagger
 *   at 3 stains. Printed "on this" / "destroy it" refers to the vest (self).
 * - Optional wraps gain+stain only; the 3-stain destroy is sequential "Then".
 * - Hit filter subtypes Dagger + actor controller is correct for dagger weapons.
 */
export const bloodSplatteredVest = defineCard(
  fabCardIdentitiesByCanonicalId["P8RBh6qWkwRjcJQMWKNQG"],
  {
    keywords: [bladeBreak],
    abilities: {
      wheneverDaggerControlHitsMayGainPutStainCounter: {
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
              filter: {
                typeBox: {
                  subtypes: ["Dagger"],
                },
              },
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
                  type: "sequence",
                  steps: [
                    {
                      type: "gain-resources",
                      amount: 1,
                    },
                    {
                      type: "add-counter",
                      counter: {
                        kind: "named",
                        name: "stain",
                      },
                      count: 1,
                      // Printed "on this" — the vest, not the dagger that hit.
                      target: {
                        selector: "self",
                      },
                    },
                  ],
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "has-counter",
                  counter: {
                    kind: "named",
                    name: "stain",
                  },
                  target: {
                    selector: "self",
                  },
                  comparison: {
                    op: "gte",
                    value: 3,
                  },
                },
                then: {
                  type: "destroy",
                  // Printed "destroy it" after stain-on-this — the vest.
                  target: {
                    selector: "self",
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
);
