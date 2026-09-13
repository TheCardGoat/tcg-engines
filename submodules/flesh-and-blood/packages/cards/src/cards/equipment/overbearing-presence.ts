import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/overbearing-presence.generated.ts";

export const overbearingPresence = defineCard(
  fabCardIdentitiesByCanonicalId["mzzkQRbJp8KjGcw6M8z6j"],
  {
    keywords: [bladeBreak],
    abilities: {
      actionDestroyCreate3VigorTokensActivateOnlyIf: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 3,
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        condition: {
          type: "pitch-zone-has",
          filter: {
            power: {
              op: "gte",
              value: 6,
            },
          },
        },
        layerKeywords: [goAgain],
        effect: {
          type: "create-token",
          token: "vigor",
          controller: "controller",
          count: 3,
        },
      },
    },
  },
);
