import { arcaneBarrier, battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/lightning-greaves.generated.ts";

export const lightningGreaves = defineCard(
  fabCardIdentitiesByCanonicalId["dpPzdRQgfkBRgcHbWMQpt"],
  {
    keywords: [arcaneBarrier(1), battleworn],
    abilities: {
      instantDestroyInstantPlayTurnGetGoAgain: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          // This is a floating, multi-use applicator. Resolving the activation
          // while no Instant is on the stack must still affect every matching
          // card subsequently played this turn.
          appliesTo: {
            next: {
              typeBox: {
                types: ["Instant"],
              },
            },
            count: 32,
          },
        },
      },
    },
  },
);
