import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mbrio-base-digits.generated.ts";

export const mbrioBaseDigits = defineCard(fabCardIdentitiesByCanonicalId["RDcn7fQgNLdCnRwjJ8pPK"], {
  keywords: [temper],
  abilities: {
    instantCogControlGets1UntilEndTurn: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-self",
          },
          {
            class: "effect",
            type: "tap",
            filter: {
              typeBox: {
                subtypes: ["Cog"],
              },
            },
          },
        ],
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
  },
});
