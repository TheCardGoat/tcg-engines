import { bloodDebt } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/carrion-husk.generated.ts";

/**
 * MON187 Carrion Husk — Shadow Chest d6 Blood Debt.
 *
 * Printed:
 *   If you defend with Carrion Husk, banish it when the combat chain closes.
 *   At the start of your turn, if you have 13 or less {h}, banish Carrion Husk.
 *   Blood Debt
 *
 * Model notes (hand-authored):
 * - a1: prior continuous + hasStatus defended-with-this + nested delayed-trigger
 *   is not a live continuous atom. Executable model (Ironhide family): static
 *   trigger on defend subject:self → delayed-trigger combat-chain-close → banish
 *   self (banish, not destroy — printed banish; lands in banished for Blood Debt).
 * - a2: start-phase self banish when life ≤ 13 (life-comparison fixed lte).
 * - Blood Debt keyword: face-up banished ticks end-phase life loss (CR 8.3.11a).
 */
export const carrionHusk = defineCard(fabCardIdentitiesByCanonicalId["KLtwtTdQqjdTJNhcQHJhd"], {
  keywords: [bloodDebt],
  abilities: {
    ifDefendCarrionHuskBanishWhenCombatChainCloses: {
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
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "combat-chain-close",
              actor: {
                kind: "none",
              },
              observes: {
                kind: "none",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-combat-chain",
            matching: "first",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "banish",
              target: {
                selector: "self",
              },
            },
          },
        },
      },
    },
    atStartTurnIfHave13LessBanishCarrion: {
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
          type: "life-comparison",
          player: "self",
          vs: "fixed",
          op: "lte",
          value: 13,
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "banish",
          target: {
            selector: "self",
          },
        },
      },
    },
  },
});
