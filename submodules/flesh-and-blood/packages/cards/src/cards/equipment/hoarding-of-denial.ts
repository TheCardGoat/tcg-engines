import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/hoarding-of-denial.generated.ts";

export const hoardingOfDenial = defineCard(
  fabCardIdentitiesByCanonicalId["m78fRjCfRBzTwhbrdDBBc"],
  {
    keywords: [bladeBreak],
    abilities: {
      getsXWhileDefendingWhereXIsNumberCost: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: {
            type: "count",
            what: "cards-defending",
            per: "chain-link",
            filter: {
              cost: {
                op: "gte",
                value: 3,
              },
            },
          },
          target: {
            selector: "self",
          },
          duration: "while-in-arena",
        },
      },
    },
  },
);
