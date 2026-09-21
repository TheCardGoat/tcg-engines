import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ollin-ice-cap.generated.ts";

export const ollinIceCap = defineCard(fabCardIdentitiesByCanonicalId["W89dCjCrz8cQKd78zHFBR"], {
  keywords: [bladeBreak],
  abilities: {
    whenDefendsTogetherIceCreateFrostbiteTokenUnderAttacking: {
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
          cohort: {
            kind: "together-with",
            filter: {
              typeBox: {
                supertypes: ["Ice"],
              },
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "frostbite",
          creator: "effect-controller",
          controller: "opponent",
        },
      },
    },
  },
});
