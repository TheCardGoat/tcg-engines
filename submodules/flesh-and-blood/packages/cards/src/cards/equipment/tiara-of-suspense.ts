import { guardwell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/tiara-of-suspense.generated.ts";

export const tiaraOfSuspense = defineCard(fabCardIdentitiesByCanonicalId["m7QtkDW9dbfgKbkWcbR68"], {
  keywords: [guardwell],
  abilities: {
    instantDestroyPutSuspenseCounterAuraSuspenseControlActivate: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: { type: "performed-this-turn", event: "cheered", player: "controller" },
      effect: {
        type: "add-counter",
        counter: {
          kind: "named",
          name: "suspense",
        },
        count: 1,
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Aura"],
            },
            hasKeyword: "suspense",
          },
          count: 1,
        },
      },
    },
  },
});
