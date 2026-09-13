import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/random-events-unfold.generated.ts";

export const randomEventsUnfold = defineCard(fabCardIdentitiesByCanonicalId.gcgCpfj86Wq8pMRnjtWpm, {
  abilities: {
    cycleEventDeck: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "sequence",
        // Event-deck shuffle/flip is out of 1v1 product scope.
        steps: [],
      },
    },
  },
});
