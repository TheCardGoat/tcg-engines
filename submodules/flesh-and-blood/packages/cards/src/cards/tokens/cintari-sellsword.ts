import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/cintari-sellsword.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const cintariSellsword = defineCard(fabCardIdentitiesByCanonicalId.CcGMKpDNfnzz8mKDqmqnc, {
  abilities: {
    attack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "weapon-attacks-this-turn" },
        comparison: { op: "gte", value: 1 },
      },
      layerKeywords: [goAgain],
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
  },
});
