import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/okana-scar-wraps.generated.ts";

export const okanaScarWraps = defineCard(fabCardIdentitiesByCanonicalId["ph6zmRnbqhCtD7T7FwpdB"], {
  keywords: [bladeBreak],
  abilities: {
    attackReactionBanishEdgeAutumnControlTargetNinjaAttack: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-self",
          },
          {
            class: "effect",
            type: "banish",
            // from:arena → permanent, which matches weapon seats via
            // catalogZoneMatchesTargetZones (Edge of Autumn is a 2H weapon).
            from: "arena",
            count: 1,
            filter: {
              // Matches slug-derived "Edge Of Autumn" / printed "Edge of Autumn"
              // via normalizeText.
              name: "Edge of Autumn",
            },
          },
        ],
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              supertypes: ["Ninja"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
    wheneverAttackControlVengeanceNameHitsMayEquipEdge: {
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
                subtypes: ["Attack"],
              },
              nameContains: "Vengeance",
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            // Destination is type-derived (Weapon → weapon seat). Source zone is
            // on the target (banished); do not echo source as effect.zone.
            type: "equip",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["banished"],
              filter: {
                // Matches slug-derived "Edge Of Autumn" / printed "Edge of Autumn"
                // via normalizeText.
                name: "Edge of Autumn",
              },
              count: 1,
            },
          },
        },
      },
    },
  },
});
