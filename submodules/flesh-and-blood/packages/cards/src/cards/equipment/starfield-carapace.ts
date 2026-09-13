import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/starfield-carapace.generated.ts";

/**
 * AZS004 Starfield Carapace — Lightning Illusionist Chest d1 Blade Break.
 *
 * Printed: Instant - Destroy this: Until end of turn, an Aphrodias you control
 * costs {r} less to activate and gets "Whenever this deals damage to an
 * opposing hero, create a Lightning Flow token." Blade Break
 *
 * Model notes (hand-authored):
 * - Target one Aphrodias permanent (weapon seat is under permanent zone).
 * - Cost −1 is represented as a first-class activation-cost modifier.
 * - Granted dealt-damage→Lightning Flow: target hero only — prior filter
 *   supertypes:["Opposing"] never matched hero type-boxes (1v1 opposing is
 *   the damage recipient of Aphrodias' arcane hit).
 */
export const starfieldCarapace = defineCard(
  fabCardIdentitiesByCanonicalId["NfgpHMJczznbc7PJKt7Kw"],
  {
    keywords: [bladeBreak],
    abilities: {
      instantDestroyUntilEndTurnAphrodiasControlCostsLess: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-activation-cost",
              op: "subtract",
              amount: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  name: "Aphrodias",
                },
                count: 1,
              },
              duration: "this-turn",
            },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "wheneverDealsDamageOpposingHeroCreateLightningFlowToken",
                  text: "",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "dealt-damage",
                      actor: {
                        kind: "any",
                      },
                      observes: {
                        kind: "none",
                      },
                      target: {
                        kind: "hero",
                      },
                    },
                  },
                  resolution: {
                    kind: "effect",
                    effect: {
                      type: "create-token",
                      token: "lightning-flow",
                      controller: "controller",
                    },
                  },
                },
              },
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  name: "Aphrodias",
                },
                count: 1,
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  },
);
