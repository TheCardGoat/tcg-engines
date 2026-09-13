import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/two-faced.generated.ts";

export const twoFaced = defineCard(fabCardIdentitiesByCanonicalId["n6twqPttCHFQnTLKBfzKz"], {
  keywords: [bladeBreak],
  abilities: {
    whenDefendsAttackingHeroDrawsThenLookAtTheir: {
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
          type: "sequence",
          steps: [
            {
              type: "draw",
              count: 1,
              // Printed "the attacking hero" (not a generic opponent).
              player: "attacking-hero",
            },
            {
              // Choose after the draw: at-resolution (decision walk simulates prior
              // draw). chooser:controller — you look and pick; they discard.
              // upTo: empty hand after a failed draw may skip the pick.
              type: "look",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attacking-hero",
                zones: ["hand"],
                count: { type: "up-to", amount: 1 },
                chooser: "controller",
              },
              outputBinding: "it",
            },
            {
              type: "discard",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
          ],
        },
      },
    },
  },
});
