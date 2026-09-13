import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/soul-shackle.generated.ts";

export const soulShackle = defineCard(fabCardIdentitiesByCanonicalId["9F6H6kTdQdcHrDrRCDmLP"], {
  abilities: {
    banishTopCard: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
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
