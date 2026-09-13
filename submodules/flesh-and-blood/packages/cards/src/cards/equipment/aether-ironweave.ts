import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/aether-ironweave.generated.ts";

export const aetherIronweave = defineCard(fabCardIdentitiesByCanonicalId["wd9TtjtPGfbWKQPprJfj9"], {
  keywords: [battleworn],
  abilities: {
    actionDestroyAetherIronweaveGainActivateAbilityOnlyIf: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "and",
        conditions: [
          {
            type: "played-this",
            per: "turn",
            filter: attackActionFilter(),
            comparison: { op: "gte", value: 1 },
          },
          {
            type: "played-this",
            per: "turn",
            filter: { typeBox: { types: ["Action"], excludeSubtypes: ["Attack"] } },
            comparison: { op: "gte", value: 1 },
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "gain-resources",
        amount: 2,
      },
    },
  },
});
