import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/edge-of-autumn.generated.ts";

export const edgeOfAutumn = defineCard(fabCardIdentitiesByCanonicalId["FfRMHD8fbLP7FjLJdmbtM"], {
  abilities: {
    oncePerTurnActionResourceAttackGoAgain: {
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
