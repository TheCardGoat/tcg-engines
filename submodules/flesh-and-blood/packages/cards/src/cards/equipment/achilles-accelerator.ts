import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/achilles-accelerator.generated.ts";

export const achillesAccelerator = defineCard(
  fabCardIdentitiesByCanonicalId["C7jcJhrdpQTMfd7F79jK9"],
  {
    keywords: [arcaneBarrier(1)],
    abilities: {
      instantDestroyAchillesAcceleratorGain1ActionPointActivate: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        condition: { type: "performed-this-turn", event: "boost", player: "controller" },
        effect: {
          type: "gain-action-points",
          amount: 1,
        },
      },
    },
  },
);
