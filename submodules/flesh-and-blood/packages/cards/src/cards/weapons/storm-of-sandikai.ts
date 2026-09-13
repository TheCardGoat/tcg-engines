import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/storm-of-sandikai.generated.ts";

export const stormOfSandikai = defineCard(fabCardIdentitiesByCanonicalId["PQm7zFjBPCzc68JDd8D6z"], {
  abilities: {
    dragonAlliesOncePerTurnAction0Attack: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            id: "oncePerTurnAction0Attack",
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
              amount: 0,
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
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            and: [
              {
                typeBox: {
                  subtypes: ["Dragon"],
                },
              },
              {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
            ],
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
  },
});
