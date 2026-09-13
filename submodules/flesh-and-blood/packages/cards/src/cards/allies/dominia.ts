import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/dominia.generated.ts";

export const dominia = defineCard(fabCardIdentitiesByCanonicalId.hjggcdqWwpwNKCrTBj6J7, {
  abilities: {
    revealAndBanishFromHandOnAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
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
                // "If it's a red card" — printed card color property
                // (UPR007 Tomeltai authored the same clause this way).
                filter: {
                  color: ["red"],
                },
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "look",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["hand"],
                      count: {
                        type: "all",
                      },
                    },
                  },
                  {
                    type: "banish",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["hand"],
                      // Printed "look at their hand and banish a card from
                      // it": Dominia's controller (who looked) picks the
                      // card. Without this the private-zone default would
                      // hand the choice to the opponent.
                      chooser: "controller",
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
