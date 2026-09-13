import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/stride-of-reprisal.generated.ts";

export const strideOfReprisal = defineCard(
  fabCardIdentitiesByCanonicalId["DhKMQzczm7mmf9HnhWhdL"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsCreateCrouchingTigerHand: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "crouching-tiger",
            controller: "controller",
            to: {
              zone: "hand",
            },
          },
        },
      },
    },
  },
);
