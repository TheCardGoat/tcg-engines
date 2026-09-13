import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/bloodrot-pox.generated.ts";

export const bloodrotPox = defineCard(fabCardIdentitiesByCanonicalId.drbBwrNtMRPTJ79LBQWWB, {
  abilities: {
    damageOrPayAtEndPhase: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
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
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "unless",
              effect: {
                type: "deal-damage",
                damageType: "generic",
                amount: 2,
                target: {
                  selector: "controller",
                },
              },
              escape: {
                type: "pay",
                cost: {
                  class: "asset",
                  type: "resources",
                  amount: 3,
                },
                payer: "controller",
              },
            },
          ],
        },
      },
    },
  },
});
