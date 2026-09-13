import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/resources/schism-of-chaos.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const schismOfChaosBlue = defineCard(fabCardIdentitiesByCanonicalId.G7MWPzRtWqBpdW7K8MQDd, {
  keywords: [legendary],
  abilities: {
    shuffleAndArsenalOnPitch: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          // "Each hero" completes its shuffle-and-arsenal action independently.
          // A single target with `player: "each"` instead creates one combined
          // pool across decks, which requires a choice and cannot represent the
          // printed top card from every deck.
          type: "for-each",
          target: { selector: "each-hero" },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "shuffle",
                zone: "deck",
                player: "iteration-subject",
              },
              {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "iteration-subject",
                  zones: ["deck"],
                  position: "top",
                  count: 1,
                },
                to: {
                  zone: "arsenal",
                },
                faceDown: true,
              },
            ],
          },
        },
      },
    },
  },
});
