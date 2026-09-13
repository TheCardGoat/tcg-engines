import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/blood-scent.generated.ts";

export const bloodScent = defineCard(fabCardIdentitiesByCanonicalId["WQzcLfDqKwCFFJMBcddJ6"], {
  keywords: [battleworn],
  abilities: {
    instantDestroyGainActivateOnlyIfVeAttackedCrouching: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "performed-this-turn",
        event: "attack-with-crouching-tiger",
        player: "controller",
      },
      effect: {
        type: "gain-resources",
        amount: 1,
      },
    },
  },
});
