import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/yoji-royal-protector.generated.ts";

export const yojiRoyalProtector = defineCard(
  fabCardIdentitiesByCanonicalId["ncc6tmdrfHgnz9DhPqnwC"],
  {
    abilities: {
      oncePerTurnInstantResourceResourceResourceNextTimeAnotherTargetDealtDamageTurnInsteadDamageDealtYojiPrevent1Damage:
        {
          kind: "activated",
          limit: {
            count: 1,
            per: "turn",
          },
          abilityType: "instant",
          cost: {
            class: "asset",
            type: "resources",
            amount: 3,
          },
          effect: {
            type: "prevention",
            preventionKind: "fixed",
            amount: 1,
            shielded: {
              selector: "object",
              declared: "on-stack",
              // "another target hero" — not Yoji; legalTargets scopes via player.
              player: "another-hero",
              zones: ["hero"],
              count: 1,
            },
            redirectTo: {
              selector: "self",
            },
            duration: "this-turn",
          },
        },
    },
  },
);
