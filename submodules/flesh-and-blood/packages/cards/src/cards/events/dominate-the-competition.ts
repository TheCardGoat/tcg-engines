import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/dominate-the-competition.generated.ts";
import { dominate } from "../shared/keywords.ts";

export const dominateTheCompetition = defineCard(
  fabCardIdentitiesByCanonicalId.DmQPbpRWTzKJcwKLdB88B,
  {
    abilities: {
      grantDominateToNextAttack: {
        kind: "static",
        staticKind: "continuous",
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
                subtypes: ["Attack"],
              },
            },
          },
        },
      },
    },
  },
);
