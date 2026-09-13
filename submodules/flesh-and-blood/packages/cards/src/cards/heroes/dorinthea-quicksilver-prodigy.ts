import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/dorinthea-quicksilver-prodigy.generated.ts";

export const dorintheaQuicksilverProdigy = defineCard(
  fabCardIdentitiesByCanonicalId["NJJCGNjdCFzrjLqGfL6mR"],
  {
    abilities: {
      firstTimeDawnbladeResplendentsAttackGetsGoAgainTurnAttackAdditionalTimeTurn: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "gain-keyword",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "object",
              relationship: {
                kind: "any",
              },
              filter: {
                nameContains: "Resplendent",
              },
              bindAs: "it",
            },
          },
        },
        resolution: {
          kind: "effect",
          // CR 5.2.3c: "you may attack an additional time" is activation-limit
          // permission, not an optional trigger the controller accepts or declines.
          effect: {
            type: "modify-activation-limit",
            target: {
              selector: "binding",
              binding: "it",
            },
            operation: "additional",
            count: 1,
            duration: "this-turn",
          },
        },
        limit: {
          count: 1,
          per: "turn",
          ordinals: [1],
        },
      },
    },
  },
);
