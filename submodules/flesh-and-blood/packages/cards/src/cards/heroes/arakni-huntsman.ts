import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/arakni-huntsman.generated.ts";

export const arakniHuntsman = defineCard(fabCardIdentitiesByCanonicalId["CKtFCgnGdwMDBh7dzDqqz"], {
  abilities: {
    wheneverPlayContractLookTopTargetOpponentsDeckPutBottom: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: {
              hasLabel: "contract",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          // Optional look, then (if you do) optional put that card on bottom.
          type: "optional",
          effect: {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          then: {
            type: "optional",
            effect: {
              type: "move-card",
              target: {
                selector: "binding",
                binding: "it",
              },
              to: {
                zone: "deck",
                position: "bottom",
              },
            },
          },
        },
      },
    },
  },
});
