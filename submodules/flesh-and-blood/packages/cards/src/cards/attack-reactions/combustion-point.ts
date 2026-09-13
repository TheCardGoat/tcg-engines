import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/combustion-point.generated.ts";

export const combustionPoint = definePitchFamily(fabPitchFamilies["combustion-point"], {
  abilities: () => ({
    boostDraconicOrNinjaAttack: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: attackActionFilter({
            or: [
              {
                typeBox: {
                  supertypes: ["Draconic"],
                },
              },
              {
                typeBox: {
                  supertypes: ["Ninja"],
                },
              },
            ],
          }),
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
    banishDefendingCard: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: {
              and: [
                {
                  defending: true,
                  typeBox: {
                    excludeTypes: ["Equipment"],
                  },
                },
                {
                  defense: {
                    op: "lt",
                    value: {
                      type: "count",
                      what: "chain-links",
                      player: "controller",
                      filter: {
                        typeBox: {
                          supertypes: ["Draconic"],
                        },
                      },
                    },
                  },
                },
              ],
            },
            count: 1,
          },
        },
      },
    },
  }),
});

export const { red: combustionPointRed } = combustionPoint.cards;
