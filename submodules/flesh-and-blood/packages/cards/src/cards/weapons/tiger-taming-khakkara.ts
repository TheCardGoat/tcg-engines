import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/tiger-taming-khakkara.generated.ts";

export const tigerTamingKhakkara = defineCard(
  fabCardIdentitiesByCanonicalId["M7nPGBJMNj6tbtDgzMNqc"],
  {
    abilities: {
      oncePerTurnActionResourceResourceAttackGoAgain: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack",
        cost: {
          class: "asset",
          type: "resources",
          amount: 2,
        },
        layerKeywords: [goAgain],
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      attacksNextCrouchingTigerPlayCombatChainGets1Power: {
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
              kind: "source",
              selector: "attack",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "this-attack",
            },
            duration: "this-combat-chain",
            // Printed "next Crouching Tiger" is a card name, not split subtypes.
            appliesTo: {
              next: {
                name: "Crouching Tiger",
              },
            },
          },
        },
      },
    },
  },
);
