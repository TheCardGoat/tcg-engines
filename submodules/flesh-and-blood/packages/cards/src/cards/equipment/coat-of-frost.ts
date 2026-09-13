import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/coat-of-frost.generated.ts";

export const coatOfFrost = defineCard(fabCardIdentitiesByCanonicalId["KdPWDMfBd8BQp66B9chCQ"], {
  abilities: {
    actionDestroyCoatFrostCreateFrostbiteTokenUnderTarget: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "create-token",
        token: "frostbite",
        controller: "any",
      },
    },
  },
});
