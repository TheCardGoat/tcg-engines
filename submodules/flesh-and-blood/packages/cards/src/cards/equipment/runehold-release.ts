import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/runehold-release.generated.ts";

export const runeholdRelease = defineCard(fabCardIdentitiesByCanonicalId["zzWc8BBmC9T6bfQwDMBPH"], {
  abilities: {
    actionDestroyCreateRunechantTokenGoAgain: {
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
      },
    },
  },
});
