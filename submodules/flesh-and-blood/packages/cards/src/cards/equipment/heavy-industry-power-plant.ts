import { goAgain, temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/heavy-industry-power-plant.generated.ts";

export const heavyIndustryPowerPlant = defineCard(
  fabCardIdentitiesByCanonicalId["6MktH8f6TgMJPmPLN8M8R"],
  {
    keywords: [temper],
    abilities: {
      actionDestroyWheneverBoostTurnGainGoAgain: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        layerKeywords: [goAgain],
        // Printed "whenever you boost this turn" is multi-fire for the turn
        // window (same pattern as CRU102 Viziertronic). Default delayed-trigger
        // is one-shot (expiresAt:triggered); event.per is not a multi-fire arm.
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "boost",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "every",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "gain-resources",
              amount: 1,
            },
          },
        },
      },
    },
  },
);
