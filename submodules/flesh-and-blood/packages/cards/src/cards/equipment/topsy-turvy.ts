import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/topsy-turvy.generated.ts";

export const topsyTurvy = defineCard(fabCardIdentitiesByCanonicalId["gkBJQ6tmkftT69RrRPRJq"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    instantDestroyUntilEndTurnIfOneMoreWould: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "move-zone",
          to: "deck",
          position: "top",
        },
        modification: {
          type: "move-card",
          target: {
            selector: "binding",
            binding: "it",
          },
          to: {
            zone: "deck",
            position: "bottom",
          },
        },
        // Printed "until end of turn" — replacement registry uses this-turn
        // expiry (same window as until-end-of-turn at turn-number granularity).
        duration: "this-turn",
      },
    },
  },
});
