import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/toughness.generated.ts";

export const toughness = defineCard(fabCardIdentitiesByCanonicalId.Cn8tK9KRm7d9KbcQk6Pqm, {
  abilities: {
    increaseNextActionDefense: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "opponent",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "modify-numeric",
              property: "defense",
              op: "add",
              amount: 1,
              target: {
                selector: "this-attack",
              },
              duration: "this-chain-link",
              appliesTo: {
                next: {
                  typeBox: {
                    types: ["Action"],
                  },
                  defending: true,
                },
              },
            },
          ],
        },
      },
    },
  },
});
