import { arcaneBarrier, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/vexing-quillhand.generated.ts";

export const vexingQuillhand = defineCard(fabCardIdentitiesByCanonicalId["wQh8rPTLTrzGqHhfbGnq6"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    actionDestroyCreate2RunechantTokensGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "create-token",
        token: "runechant",
        controller: "controller",
        count: 2,
      },
    },
  },
});
