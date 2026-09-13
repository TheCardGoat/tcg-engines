import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/popped-collar-polo.generated.ts";

export const poppedCollarPolo = defineCard(
  fabCardIdentitiesByCanonicalId["KLrGzkPn8QfB6cqNqcN8m"],
  {
    abilities: {
      actionDestroyGainGoAgain: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        layerKeywords: [goAgain],
        effect: {
          type: "gain-resources",
          amount: 1,
        },
      },
    },
  },
);
