import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/resources/master-cog.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const masterCogYellow = defineCard(fabCardIdentitiesByCanonicalId.MLR9kCDtWdr7c67FQtNw7, {
  keywords: [legendary],
  abilities: {
    addSteamCounterOnPitch: {
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
          type: "optional",
          effect: {
            type: "add-counter",
            counter: {
              kind: "named",
              name: "steam",
            },
            count: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Item"],
                },
                hasKeyword: "crank",
              },
              count: 1,
            },
          },
        },
      },
    },
  },
});
