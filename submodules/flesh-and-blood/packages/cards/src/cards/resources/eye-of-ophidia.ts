import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/resources/eye-of-ophidia.generated.ts";
import { legendary, opt } from "../shared/keywords.ts";

export const eyeOfOphidiaBlue = defineCard(fabCardIdentitiesByCanonicalId.N77hdGp96fNQnzc79hqN9, {
  keywords: [legendary, opt(2)],
  abilities: {
    optOnPitch: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "pitched-card",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Eye Of Ophidia",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "opt",
          count: 2,
        },
      },
    },
  },
});
