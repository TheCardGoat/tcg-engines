import { guardwell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/balance-of-justice.generated.ts";

export const balanceOfJustice = defineCard(
  fabCardIdentitiesByCanonicalId["fFHTT7tCd9NDBqn9qCgh6"],
  {
    keywords: [guardwell],
    abilities: {
      instantDestroyDrawActivateOnlyIfOpponentHasDrawn: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        condition: {
          type: "compare-amount",
          amount: { type: "count", what: "cards-drawn-this-turn", player: "opponent" },
          comparison: { op: "gte", value: 2 },
        },
        effect: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
  },
);
