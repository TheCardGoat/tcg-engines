import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/boots-of-omnis-ward.generated.ts";

export const bootsOfOmnisWard = defineCard(
  fabCardIdentitiesByCanonicalId["bqhGbpG9NhgMcGGKdLwRM"],
  {
    keywords: [temper],
    abilities: {
      ifVeBeenDealtArcaneDamageTurnGets1: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "damage-taken",
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
      instantHeroDestroyPreventNext1DamageWouldBe: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "effect",
              type: "tap-hero",
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        effect: {
          type: "prevention",
          preventionKind: "fixed",
          amount: 1,
          shielded: {
            selector: "controller",
          },
          duration: "this-turn",
        },
      },
    },
  },
);
