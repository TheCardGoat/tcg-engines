import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/helm-of-safe-haven.generated.ts";

export const helmOfSafeHaven = defineCard(fabCardIdentitiesByCanonicalId["HDD8FDbbhgKFmpHBGCL9c"], {
  keywords: [bladeBreak],
  abilities: {
    whenDefendsRevealTopDeckIfSAttackAction: {
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
              type: "reveal",
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
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: attackActionFilter(),
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    // Deck-origin add-defending (engine path; not hand fallback).
                    type: "add-defending",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                  },
                  {
                    type: "discard",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["hand"],
                      count: 1,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
});
