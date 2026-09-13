import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/resources/will-of-arcana.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const willOfArcanaBlue = defineCard(fabCardIdentitiesByCanonicalId.r8Tw7FhnRPfndW8kWB7Rr, {
  keywords: [
    legendary,
    {
      name: "amp",
      value: 1,
    },
  ],
  abilities: {
    ampOnPitch: {
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
          type: "amp",
          amount: 1,
        },
      },
    },
  },
});
