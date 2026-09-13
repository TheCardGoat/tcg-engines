import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/crushing-impact.generated.ts";

export const crushingImpact = defineCard(fabCardIdentitiesByCanonicalId["9qQTtRm6phFRbknPqHqM6"], {
  abilities: {
    raiseNextDamageToFour: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "deal-damage",
          player: "controller",
          comparison: {
            op: "lt",
            value: 4,
          },
        },
        modification: {
          type: "modify-numeric",
          property: "count",
          op: "set-base",
          amount: 4,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        duration: "this-turn",
      },
    },
  },
});
