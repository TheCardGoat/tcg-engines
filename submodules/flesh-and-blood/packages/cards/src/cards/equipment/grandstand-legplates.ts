import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/grandstand-legplates.generated.ts";

export const grandstandLegplates = defineCard(
  fabCardIdentitiesByCanonicalId["zBCwfCKHpdpkngRHWMFhN"],
  {
    keywords: [bladeBreak],
    abilities: {
      grandstandLegplatesIsEqualNumberOpposingHeroesGreaterThan: {
        kind: "static",
        staticKind: "property",
        property: "defense",
        value: {
          type: "count",
          what: "heroes",
          player: "opponent",
          filter: {
            hasStatus: "greater-life-than-controller",
          },
        },
      },
    },
  },
);
