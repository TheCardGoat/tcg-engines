import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/graven-vestment.generated.ts";

/**
 * PEN138 Graven Vestment — Assassin Chest d2 Blade Break.
 *
 * Printed:
 *   While this is in your graveyard, at the start of your turn, you may
 *   destroy 2 Silver you control. If you do, equip this.
 *   When this is equipped from anywhere other than your graveyard, put a
 *   -1{d} counter on it.
 *   Blade Break
 *
 * Model notes (hand-authored; chest twin of PEN137 graven-cowl):
 * - a1 is GY-functional only: functionalZones:["graveyard"] +
 *   in-your-graveyard condition (must not fire while equipped).
 * - Silver filter is name:"Silver" (token type-box Token+Item; subtypes
 *   residue never matches).
 * - a2 equip from non-GY → −1{d}; equip from GY (a1 then) does not.
 */
export const gravenVestment = defineCard(fabCardIdentitiesByCanonicalId["JccrcTgJrBnTWHqk6GnTP"], {
  keywords: [bladeBreak],
  abilities: {
    whileIsGraveyardAtStartTurnMayDestroy2: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "has-status",
          status: "in-your-graveyard",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              // Silver tokens are Token Items named Silver (not a subtype vocabulary).
              filter: {
                name: "Silver",
              },
              count: 2,
            },
          },
          then: {
            type: "equip",
            target: {
              selector: "self",
            },
          },
        },
      },
      // GY-static: functions only while in graveyard (not while equipped).
      functionalZones: ["graveyard"],
    },
    whenIsEquippedFromAnywhereOtherThanGraveyardPut: {
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
          excludeFrom: ["graveyard"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "add-counter",
          counter: {
            kind: "numeric",
            value: -1,
            property: "defense",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
      },
    },
  },
});
