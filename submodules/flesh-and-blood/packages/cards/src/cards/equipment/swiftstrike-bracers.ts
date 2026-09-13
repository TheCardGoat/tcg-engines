import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/swiftstrike-bracers.generated.ts";

export const swiftstrikeBracers = defineCard(
  fabCardIdentitiesByCanonicalId["69mRCnm9t6Dcjkk9H8RhG"],
  {
    abilities: {
      actionDestroyNextAttackTurnGets2ActivateOnly: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        condition: {
          type: "played-this",
          per: "turn",
          filter: { name: "Nimblism" },
          comparison: { op: "gte", value: 1 },
        },
        layerKeywords: [goAgain],
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 2,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
          },
        },
      },
    },
  },
);
