import { battleworn, dominate, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/craterhoof.generated.ts";

export const craterhoof = defineCard(fabCardIdentitiesByCanonicalId["8LDQbNHPK7NC9Lg8phzrk"], {
  keywords: [battleworn],
  abilities: {
    actionDestroyNextGuardianAttackActionPlayFromArsenal: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 3,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: dominate,
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Guardian"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
            playedFromZones: ["arsenal"],
          },
        },
      },
    },
  },
});
