import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/hammer-of-havenhold.generated.ts";

export const hammerOfHavenhold = defineCard(
  fabCardIdentitiesByCanonicalId["DLCqPPF6cRwMCgdhRBj6F"],
  {
    abilities: {
      oncePerTurnActionResourceResourceResourceAttack: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack",
        cost: {
          class: "asset",
          type: "resources",
          amount: 3,
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      chivalryPitchZoneGets1Power: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "pitch-zone-has",
          filter: {
            name: "Chivalry",
          },
        },
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  },
);
