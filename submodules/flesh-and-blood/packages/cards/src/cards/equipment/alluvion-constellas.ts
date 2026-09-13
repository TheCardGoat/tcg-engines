import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/alluvion-constellas.generated.ts";

/**
 * UPR166 Alluvion Constellas — Wizard Chest d0 Arcane Barrier 1.
 *
 * Printed:
 *   The first time Alluvion Constellas prevents arcane damage each turn, if it
 *   has less than 4 energy counters, you may put an energy counter on it.
 *   Instant - Remove 2 energy counters: The next staff ability you activate
 *   this turn costs {r}{r}{r} less.
 *   Arcane Barrier 1
 *
 * Model notes (hand-authored):
 * - a1 "Alluvion Constellas prevents" requires subject:self on prevent so
 *   other barriers/spellvoids do not feed energy. Engine primaryEventObject
 *   for prevent uses event.source (prevention source), not damage-dealer.
 * - a2 next Staff ability cost −3 (appliesTo next subtypes Staff).
 */
export const alluvionConstellas = defineCard(
  fabCardIdentitiesByCanonicalId["DgpbP8LBpCffdNgH8t9LB"],
  {
    keywords: [arcaneBarrier(1)],
    abilities: {
      firstTimeAlluvionConstellasPreventsArcaneDamageEachTurn: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "prevent",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "source",
              selector: "prevention-source",
            },
            damageType: "arcane",
          },
          state: {
            type: "has-counter",
            counter: {
              kind: "named",
              name: "energy",
            },
            comparison: {
              op: "lt",
              value: 4,
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "add-counter",
              counter: {
                kind: "named",
                name: "energy",
              },
              count: 1,
              target: {
                selector: "self",
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
      instantRemove2EnergyCountersFromAlluvionConstellasNext: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "remove-counters",
          counter: {
            kind: "named",
            name: "energy",
          },
          count: 2,
        },
        effect: {
          // The engine's one-shot activation-discount primitive: activation
          // quotes never consult the object's evaluated Cost, so a modify-
          // numeric "cost" can never discount an activation — the supported
          // shape is modify-activation-cost + appliesTo.next latched on
          // "activate" events (DTD004/CRU081 golden; FIX-5, plan §5).
          type: "modify-activation-cost",
          op: "subtract",
          amount: 3,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Staff"],
              },
            },
            count: 1,
            perTurn: true,
          },
        },
      },
    },
  },
);
