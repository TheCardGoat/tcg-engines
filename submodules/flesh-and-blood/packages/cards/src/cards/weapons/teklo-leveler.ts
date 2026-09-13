import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/teklo-leveler.generated.ts";

export const tekloLeveler = defineCard(fabCardIdentitiesByCanonicalId["JR8LzTchKj8QmqkCN7GHw"], {
  abilities: {
    scaleAttackWithEquippedEvos: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "conditional",
            condition: {
              type: "equipped-count",
              filter: {
                typeBox: {
                  subtypes: ["Evo"],
                },
              },
              comparison: {
                op: "gte",
                value: 1,
              },
            },
            then: {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  id: "oncePerTurnActionResourceResourceResourceAttack",
                  text: "",
                  kind: "activated",
                  limit: {
                    count: 1,
                    per: "turn",
                  },
                  abilityType: "attack",
                  cost: {
                    class: "asset",
                    type: "resources",
                    amount: 3,
                  },
                  effect: {
                    type: "attack-with",
                    target: {
                      selector: "self",
                    },
                  },
                },
              },
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "equipped-count",
              filter: {
                typeBox: {
                  subtypes: ["Evo"],
                },
              },
              comparison: {
                op: "gte",
                value: 2,
              },
            },
            then: {
              type: "modify-activation-cost",
              op: "subtract",
              amount: 2,
              target: {
                selector: "self",
              },
              duration: "while-in-arena",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "equipped-count",
              filter: {
                typeBox: {
                  subtypes: ["Evo"],
                },
              },
              comparison: {
                op: "gte",
                value: 3,
              },
            },
            then: {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "equipped-count",
              filter: {
                typeBox: {
                  subtypes: ["Evo"],
                },
              },
              comparison: {
                op: "gte",
                value: 4,
              },
            },
            then: {
              type: "modify-numeric",
              property: "power",
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
});
