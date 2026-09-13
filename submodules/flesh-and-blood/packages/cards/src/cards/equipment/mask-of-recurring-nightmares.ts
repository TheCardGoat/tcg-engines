import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mask-of-recurring-nightmares.generated.ts";

export const maskOfRecurringNightmares = defineCard(
  fabCardIdentitiesByCanonicalId["qdzjnDqPpGjnHHqPgzmQC"],
  {
    keywords: [bladeBreak],
    abilities: {
      oncePerTurnAttackReactionTargetDefendingHeroBanishes: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack-reaction",
        cost: {
          class: "asset",
          type: "chi",
          amount: 3,
        },
        effect: {
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "defending-hero",
            zones: ["hand"],
            count: 1,
          },
        },
      },
    },
  },
);
