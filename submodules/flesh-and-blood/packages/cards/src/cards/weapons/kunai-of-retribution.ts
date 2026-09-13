import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/kunai-of-retribution.generated.ts";

export const kunaiOfRetribution = defineCard(
  fabCardIdentitiesByCanonicalId["kcf6QQMkQC8Mw9DBk78KN"],
  {
    abilities: {
      oncePerTurnActionResourceDestroyCombatChainClosesAttackGoAgain: {
        kind: "activated",
        // Printed cost is {r} plus a delayed destroy when the combat chain closes —
        // NOT destroy-self as an activation cost (that removed the weapon before
        // the attack could resolve).
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
        layerKeywords: [goAgain],
        effect: {
          type: "sequence",
          steps: [
            {
              type: "attack-with",
              target: {
                selector: "self",
              },
            },
            {
              type: "delayed-trigger",
              trigger: {
                kind: "event",
                event: {
                  name: "combat-chain-close",
                  actor: {
                    kind: "none",
                  },
                  observes: {
                    kind: "none",
                  },
                },
              },
              policy: {
                kind: "windowed",
                duration: "this-combat-chain",
                matching: "first",
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
          ],
        },
      },
    },
  },
);
