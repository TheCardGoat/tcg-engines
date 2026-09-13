import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/shatter.generated.ts";

export const shatter = definePitchFamily(fabPitchFamilies["shatter"], {
  abilities: () => ({
    grantDestroyDefendingEquipment: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            id: "destroyDefendingEquipmentInsteadOfDamage",
            text: "",
            kind: "static",
            staticKind: "continuous",
            effect: {
              type: "replacement",
              replacementKind: "standard",
              replaces: {
                name: "damage",
                damageType: "physical",
                subject: "self",
              },
              modification: {
                type: "optional",
                effect: {
                  type: "destroy",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    zones: ["combat-chain"],
                    filter: {
                      typeBox: {
                        types: ["Equipment"],
                      },
                      hasStatus: "defending",
                      defense: {
                        op: "lt",
                        value: {
                          type: "event-amount",
                        },
                      },
                    },
                    count: 1,
                  },
                },
              },
              duration: "while-in-arena",
            },
          },
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "any",
          zones: ["weapon"],
          filter: {
            typeBox: {
              subtypes: ["2H"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { yellow: shatterYellow } = shatter.cards;
