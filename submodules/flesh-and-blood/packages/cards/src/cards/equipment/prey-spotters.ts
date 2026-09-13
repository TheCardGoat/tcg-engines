import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/prey-spotters.generated.ts";

export const preySpotters = defineCard(fabCardIdentitiesByCanonicalId["9Rc87J7TGt8DWffqnKjCf"], {
  keywords: [battleworn],
  abilities: {
    attackReactionDestroyMarkTargetOpposingHero: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "mark",
        target: {
          selector: "opponent",
        },
      },
    },
  },
});
