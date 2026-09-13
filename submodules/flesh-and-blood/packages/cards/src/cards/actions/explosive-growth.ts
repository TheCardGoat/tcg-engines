import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/explosive-growth.generated.ts";
export const explosiveGrowth = definePitchFamily(fabPitchFamilies["explosive-growth"], {
  keywords: [fusion("Earth")],
  abilities: () => ({
    resolutionHasStatusFusedDelayedTriggerDealtDamageModifyNumeric: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "dealt-damage",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "source",
              selector: "damage-source",
            },
          },
        },
        // Printed "whenever it deals damage": every damage instance within the
        // chain window re-arms the rider (CR 6.6 delayed-layer semantics);
        // each firing contributes its own +1{p} for this combat chain.
        policy: {
          kind: "windowed",
          duration: "this-chain-link",
          matching: "every",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
              count: {
                type: "all",
              },
            },
            duration: "this-combat-chain",
          },
        },
      },
    },
    staticTriggeredAttackDealDamageArcane: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
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
              name: "Explosive Growth",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 1,
          target: {
            selector: "any-hero",
          },
        },
      },
    },
  }),
});
export const {
  red: explosiveGrowthRed,
  yellow: explosiveGrowthYellow,
  blue: explosiveGrowthBlue,
} = explosiveGrowth.cards;
