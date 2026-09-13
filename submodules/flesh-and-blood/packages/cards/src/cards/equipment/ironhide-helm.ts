import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ironhide-helm.generated.ts";

export const ironhideHelm = defineCard(fabCardIdentitiesByCanonicalId["kJJJmpKfCzqkzCM9DW9Nw"], {
  abilities: {
    whenDefendIronhideHelmMayPayIfDoGains: {
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
          type: "optional",
          effect: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            payer: "controller",
          },
          then: {
            // Printed "gains +2{d} and 'When the combat chain closes, destroy…'".
            // Executable model: continuous +2{d} + delayed-trigger destroy
            // (granted mid-combat static triggers do not re-register for the
            // same chain's combat-chain-close event).
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "defense",
                op: "add",
                amount: 2,
                target: {
                  selector: "self",
                },
                duration: "permanent",
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
  },
});
