import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/heroic-grit.generated.ts";

export const heroicGrit = definePitchFamily(fabPitchFamilies["heroic-grit"], {
  abilities: () => ({
    nextAttackTurnGetsGets1PowerToughnessToken: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            id: "gets1PowerToughnessToken",
            text: "",
            kind: "static",
            staticKind: "continuous",
            effect: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: {
                type: "count",
                what: "cards-in-zone",
                zone: "permanent",
                player: "controller",
                filter: {
                  name: "Toughness",
                  typeBox: {
                    metatypes: ["Token"],
                  },
                },
              },
              target: {
                selector: "self",
              },
              duration: "while-in-arena",
            },
          },
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
    createToughnessToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "toughness",
        controller: "controller",
      },
    },
  }),
});

export const { yellow: heroicGritYellow } = heroicGrit.cards;
