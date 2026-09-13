import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/resources/plague-hive.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const plagueHiveYellow = defineCard(fabCardIdentitiesByCanonicalId.GKWhbqnhnR6ztt9gCzmLw, {
  keywords: [legendary],
  abilities: {
    createRandomAfflictionsOnPitch: {
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
              name: "Plague Hive",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "for-each",
          target: {
            selector: "each-other-hero",
          },
          effect: {
            type: "choose-and-create-token",
            options: ["inertia", "frailty", "bloodrot-pox"],
            chooser: "controller",
            random: true,
            controller: "opponent",
          },
        },
      },
    },
  },
});
