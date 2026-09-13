import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/target-totalizer.generated.ts";

export const targetTotalizer = defineCard(fabCardIdentitiesByCanonicalId["QBPpDnWkrTkRMnJBkjHLq"], {
  abilities: {
    actionDestroyWheneverArrowAimCounterHitsTurnDraw: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  subtypes: ["Arrow"],
                },
                hasCounter: "aim",
              },
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "every",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "draw",
            count: 1,
            player: "controller",
          },
        },
      },
    },
  },
});
