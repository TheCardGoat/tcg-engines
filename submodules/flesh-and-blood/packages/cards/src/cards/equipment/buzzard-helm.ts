import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/buzzard-helm.generated.ts";

export const buzzardHelm = defineCard(fabCardIdentitiesByCanonicalId["Kw9PPtD6DbnRWtNctNrbD"], {
  keywords: [temper],
  abilities: {
    whenDefendsDrawThenDiscardRandomIf6More: {
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
              player: "controller",
            },
            {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                count: 1,
                random: true,
              },
              outputBinding: "it",
            },
            {
              // Printed "if a card with 6 or more {p} is discarded this way" —
              // bind the discard, then match its power (not an unwired status).
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  power: { op: "gte", value: 6 },
                },
              },
              then: {
                type: "modify-numeric",
                property: "defense",
                op: "add",
                amount: 1,
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
  },
});
