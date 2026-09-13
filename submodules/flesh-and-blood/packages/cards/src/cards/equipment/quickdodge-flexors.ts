import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/quickdodge-flexors.generated.ts";

export const quickdodgeFlexors = defineCard(
  fabCardIdentitiesByCanonicalId["kg7JPwP7pDg9wGqqQ76HT"],
  {
    abilities: {
      defenseReactionAddActiveChainLinkAsDefendingHas: {
        kind: "activated",
        abilityType: "defense-reaction",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "add-defending",
              target: {
                selector: "self",
              },
            },
            {
              type: "modify-numeric",
              property: "defense",
              op: "set-base",
              amount: 2,
              target: {
                selector: "self",
              },
              duration: "this-chain-link",
            },
          ],
        },
      },
      atBeginningEndPhaseIfDefendendTurnDestroy: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "end-phase",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "none",
            },
          },
          state: { type: "moved-this-turn", to: "combat-chain", onlySource: true },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "destroy",
            target: {
              selector: "self",
            },
          },
        },
      },
    },
  },
);
