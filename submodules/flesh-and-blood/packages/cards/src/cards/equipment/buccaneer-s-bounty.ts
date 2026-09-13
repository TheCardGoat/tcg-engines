import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/buccaneer-s-bounty.generated.ts";

export const buccaneerSBounty = defineCard(
  fabCardIdentitiesByCanonicalId["KL6rbKJcpRFhNFLwbkbbg"],
  {
    keywords: [bladeBreak],
    abilities: {
      actionDestroyGainGoAgain: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        layerKeywords: [goAgain],
        effect: {
          type: "gain-resources",
          amount: 1,
        },
      },
    },
  },
);
