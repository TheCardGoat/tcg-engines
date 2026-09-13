import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/nom-de-plume.generated.ts";

export const nomDePlume = defineCard(fabCardIdentitiesByCanonicalId["GkMGqFmbbrpwRCGHJknjt"], {
  abilities: {
    actionDestroyEachHeroDrawsGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "draw",
        count: 1,
        player: "each",
      },
    },
  },
});
