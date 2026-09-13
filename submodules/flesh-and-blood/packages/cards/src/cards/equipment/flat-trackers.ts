import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/flat-trackers.generated.ts";

export const flatTrackers = defineCard(fabCardIdentitiesByCanonicalId["RNdgT9tDmGkztGN7zpkRn"], {
  keywords: [bladeBreak],
  abilities: {
    actionDestroyCreateAgilityTokenGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "create-token",
        token: "agility",
        controller: "controller",
      },
    },
  },
});
