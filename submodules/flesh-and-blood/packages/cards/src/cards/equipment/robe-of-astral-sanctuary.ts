import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/robe-of-astral-sanctuary.generated.ts";

export const robeOfAstralSanctuary = defineCard(
  fabCardIdentitiesByCanonicalId["RT8TnMD9BHtJg8Fr6DLRF"],
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
