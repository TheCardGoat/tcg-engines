import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/tempest-dancers.generated.ts";

export const tempestDancers = defineCard(fabCardIdentitiesByCanonicalId["hfTBtd9wKBC6TzhCqQ6mn"], {
  keywords: [bladeBreak],
  abilities: {
    whenLeavesArenaMayPlayNextNonAttackAction: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "play-card",
            fromZones: ["hand", "arsenal"],
            source: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand", "arsenal"],
              count: 1,
              filter: {
                typeBox: {
                  types: ["Action"],
                  excludeSubtypes: ["Attack"],
                },
              },
            },
            appliesTo: {
              next: {
                typeBox: {
                  types: ["Action"],
                  excludeSubtypes: ["Attack"],
                },
              },
            },
            duration: "this-turn",
            asType: "instant",
          },
        },
      },
    },
  },
});
