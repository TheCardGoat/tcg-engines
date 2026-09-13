import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/tectonic-plating.generated.ts";

export const tectonicPlating = defineCard(fabCardIdentitiesByCanonicalId["TN6DmN7GK9DtMKd9pnmwF"], {
  keywords: [battleworn],
  abilities: {
    oncePerTurnActionCreateSeismicSurgeAuraToken: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "create-token",
        // Canonical token id matches WTR075 seismic-surge / token-registry.
        token: "seismic-surge",
        controller: "controller",
      },
    },
  },
});
