import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/terra.generated.ts";

export const terra = defineCard(fabCardIdentitiesByCanonicalId["JbQPwq8DkLpDdjHCP9www"], {
  keywords: [
    {
      name: "essence",
      supertypes: ["Earth"],
    },
  ],
  abilities: {
    beginningEndPhaseThereEarthPitchZonePayResourceCreateMightToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "end-phase",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "zone-count",
          zone: "pitch",
          player: "controller",
          filter: {
            typeBox: {
              supertypes: ["Earth"],
            },
          },
          comparison: {
            op: "gte",
            value: 1,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            payer: "controller",
          },
          then: {
            type: "create-token",
            token: "might",
            controller: "controller",
          },
        },
      },
    },
  },
});
