import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/boots-of-astral-sanctuary.generated.ts";

export const bootsOfAstralSanctuary = defineCard(
  fabCardIdentitiesByCanonicalId["CTRdQTjDrHNjCDh9nnDGB"],
  {
    abilities: {
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
