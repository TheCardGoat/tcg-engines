import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/talishar-the-lost-prince.generated.ts";

export const talisharTheLostPrince = defineCard(
  fabCardIdentitiesByCanonicalId["8CrHbRjngmzcwbkWMg9gb"],
  {
    abilities: {
      oncePerTurnActionResourceResourcePutRustCounterTalisharLostPrinceAttack: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 2,
            },
            {
              class: "effect",
              type: "add-counter",
              counter: {
                kind: "named",
                name: "rust",
              },
              count: 1,
            },
          ],
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      beginningEndPhaseTalisharLostPrince3MoreRustCountersDestroy: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "end-phase",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
          state: {
            type: "has-counter",
            counter: {
              kind: "named",
              name: "rust",
            },
            target: {
              selector: "self",
            },
            comparison: {
              op: "gte",
              value: 3,
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "destroy",
            target: {
              selector: "self",
            },
          },
        },
      },
    },
  },
);
