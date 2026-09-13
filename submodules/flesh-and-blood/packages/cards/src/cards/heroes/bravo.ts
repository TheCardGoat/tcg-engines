import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/bravo.generated.ts";
import { dominate, goAgain } from "../shared/keywords.ts";

export const bravo = defineCard(fabCardIdentitiesByCanonicalId["tzTbzLkLhDzmW9QMJr9KF"], {
  abilities: {
    actionResourceResourceEndTurnAttackActionCost3MoreGetDominateGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 2,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: dominate,
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["stack", "combat-chain"],
          filter: attackActionFilter({
            numeric: [
              {
                property: "cost",
                basis: "base",
                comparison: { op: "gte", value: 3 },
              },
            ],
          }),
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
  },
});
