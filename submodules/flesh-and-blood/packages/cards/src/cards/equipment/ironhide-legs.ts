import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ironhide-legs.generated.ts";

export const ironhideLegs = defineCard(fabCardIdentitiesByCanonicalId["d7FgThnkGzdhQBPmFgnrn"], {
  abilities: {
    whenDefendIronhideLegsMayPayIfDoGains: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "defender",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Ironhide Legs",
            },
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
                type: "grant-property",
                property: {
                  kind: "ability",
                  ability: {
                    kind: "static",
                    staticKind: "triggered",
                    id: "whenCombatChainClosesDestroyIronhideLegs",
                    text: "",
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
                target: {
                  selector: "self",
                },
                duration: "permanent",
              },
            ],
          },
        },
      },
    },
  },
});
