import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/might.generated.ts";

export const might = defineCard(fabCardIdentitiesByCanonicalId["6gqTwGnmHjkCLDqKPWt8c"], {
  abilities: {
    empowerNextAttackAtStartOfTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
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
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {},
                events: ["attack"],
              },
            },
          ],
        },
      },
    },
  },
});
