import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/dash-database.generated.ts";

export const dashDatabase = defineCard(fabCardIdentitiesByCanonicalId["N6TDqDNWfKfrz6G6jNrQQ"], {
  abilities: {
    lookTopDeckAnyTime: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "look",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["deck"],
          position: "top",
          count: 1,
        },
        duration: "permanent",
      },
    },
    playMechanologistItemCost01TopDeckThoughWereInstantCostsAdditionalResourcePlay: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["deck"],
        position: "top",
        filter: {
          and: [
            {
              typeBox: {
                supertypes: ["Mechanologist"],
              },
            },
            {
              typeBox: {
                subtypes: ["Item"],
              },
            },
          ],
          numeric: [
            {
              property: "cost",
              basis: "base",
              comparison: { op: "lte", value: 1 },
            },
          ],
        },
        asType: "instant",
        costModification: {
          increase: 1,
        },
      },
    },
  },
});
