import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/wayfinder-s-crest.generated.ts";

export const wayfinderSCrest = defineCard(fabCardIdentitiesByCanonicalId["rtR8zKcQtHFKrqQKLwBWC"], {
  keywords: [bladeBreak],
  abilities: {
    whenDefendWayfinderSCrestLookAtTopTarget: {
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
          type: "look",
          target: {
            selector: "object",
            declared: "at-resolution",
            // Printed "target hero's deck": declare the hero when the trigger
            // layer is added (CR 1.8.5); only that hero's top is disclosed.
            playerTarget: { selector: "any-hero" },
            playerTargetBinding: "wayfinder-target-hero",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          outputBinding: "it",
        },
      },
    },
  },
});
