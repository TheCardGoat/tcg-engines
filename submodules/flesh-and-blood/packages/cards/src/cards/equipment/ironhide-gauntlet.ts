import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ironhide-gauntlet.generated.ts";

/**
 * MON243 Ironhide Gauntlet — Generic Arms d0.
 *
 * Printed:
 *   When you defend with Ironhide Gauntlet, you may pay {r}. If you do, it gains
 *   +2{d} and "When the combat chain closes, destroy Ironhide Gauntlet."
 *
 * Model notes (hand-authored; arms twin of Ironhide Helm/Plate):
 * - Trigger subject:self (name filter is fragile vs co-defenders / slug names).
 * - Optional pay → +2{d} permanent for the block + delayed-trigger destroy self
 *   on combat-chain-close (granted mid-combat static triggers do not re-register
 *   for the same chain's close event — delayed-trigger is the executable path).
 */
export const ironhideGauntlet = defineCard(
  fabCardIdentitiesByCanonicalId["FWzdtMmz6kCcWBpWDMLmM"],
  {
    abilities: {
      whenDefendIronhideGauntletMayPayIfDoGains: {
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
            type: "optional",
            effect: {
              type: "pay",
              cost: {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              payer: "controller",
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "modify-numeric",
                  property: "defense",
                  op: "add",
                  amount: 2,
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
                },
                {
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
                      type: "destroy",
                      target: {
                        selector: "self",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
);
