import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/captain-s-coat.generated.ts";

export const captainSCoat = defineCard(fabCardIdentitiesByCanonicalId["hmr8mCTP6dhctND9KcFjp"], {
  abilities: {
    actionDestroyGainActivateOnlyIfVeDrawnTurn: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: { type: "performed-this-turn", event: "draw", player: "controller" },
      layerKeywords: [goAgain],
      effect: {
        type: "gain-resources",
        amount: 1,
      },
    },
  },
});
