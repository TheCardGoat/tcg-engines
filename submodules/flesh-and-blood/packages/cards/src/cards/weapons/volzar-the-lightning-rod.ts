import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/volzar-the-lightning-rod.generated.ts";

export const volzarTheLightningRod = defineCard(
  fabCardIdentitiesByCanonicalId["CzwrwtC7LkmK6mchdpzB7"],
  {
    abilities: {
      auraPermanentSigilNameCostsResourceLessActivate: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "control-object",
          filter: {
            and: [
              {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
              {
                nameContains: "Sigil",
              },
            ],
          },
        },
        effect: {
          type: "modify-activation-cost",
          op: "subtract",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "while-in-arena",
        },
      },
      oncePerTurnInstantResourceAmpXWhereXNumberLightningPlayedTurn: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "instant",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
        effect: {
          type: "amp",
          amount: {
            type: "count",
            what: "cards-played-this-turn",
            filter: {
              typeBox: {
                supertypes: ["Lightning"],
              },
            },
          },
        },
      },
    },
  },
);
