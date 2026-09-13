import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/gloves-of-astral-sanctuary.generated.ts";

export const glovesOfAstralSanctuary = defineCard(
  fabCardIdentitiesByCanonicalId["BMkwBQtHCCnhhwjTCbLGR"],
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
