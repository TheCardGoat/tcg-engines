import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/cogwerx-base-chest.generated.ts";

/**
 * EVO015 Cogwerx Base Chest — Mechanologist Base Chest.
 *
 * Printed:
 *   When this is equipped, put a steam counter on it.
 *   Once per Turn Instant - {r}, remove a steam counter from this: Gain {r}{r}.
 *   Activate this ability only if you've boosted this turn.
 *
 * Model notes (hand-authored, sibling of EVO014 Cogwerx Base Head):
 * - Equip trigger uses subject:self so other equips do not fire.
 * - Instant: mixed 1{r} + remove steam → gain 2{r}; boosted-this-turn gate.
 */
export const cogwerxBaseChest = defineCard(
  fabCardIdentitiesByCanonicalId["gqwdRLGrnGc9PbBQjMnpk"],
  {
    abilities: {
      whenIsEquippedPutSteamCounter: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "equip",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "source",
              selector: "moved-object",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "add-counter",
            counter: {
              kind: "named",
              name: "steam",
            },
            count: 1,
            target: {
              selector: "self",
            },
          },
        },
      },
      oncePerTurnInstantRemoveSteamCounterFromGain: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            {
              class: "effect",
              type: "remove-counters",
              counter: {
                kind: "named",
                name: "steam",
              },
              count: 1,
            },
          ],
        },
        condition: { type: "performed-this-turn", event: "boost", player: "controller" },
        effect: {
          type: "gain-resources",
          amount: 2,
        },
      },
    },
  },
);
