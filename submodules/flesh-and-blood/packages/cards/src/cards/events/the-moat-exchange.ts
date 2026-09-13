import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/the-moat-exchange.generated.ts";

export const theMoatExchange = defineCard(fabCardIdentitiesByCanonicalId.qhgBBWfkQcrgzKMTqQ7RC, {
  abilities: {
    exchangeHandsAndArsenals: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "for-each",
            target: {
              selector: "each-hero",
            },
            effect: {
              type: "optional",
              effect: {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  zones: ["hand", "arsenal"],
                  count: {
                    type: "all",
                  },
                },
                to: {
                  zone: "deck",
                  position: "bottom",
                },
              },
            },
          },
          {
            type: "draw",
            count: {
              type: "count",
              what: "put-on-bottom-this-way",
            },
            player: "each",
          },
        ],
      },
    },
  },
});
