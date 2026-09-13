import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/blackstone-greaves.generated.ts";

export const blackstoneGreaves = defineCard(
  fabCardIdentitiesByCanonicalId["JgH7RNTPbJkM6Bqc7HJgT"],
  {
    keywords: [temper],
    abilities: {
      ifVeDealtArcaneDamageTurnGets1: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "damage-dealt",
          damageType: "arcane",
          player: "controller",
          per: "turn",
          comparison: {
            op: "gte",
            value: 1,
          },
        },
        effect: {
          type: "modify-numeric",
          property: "defense",
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
