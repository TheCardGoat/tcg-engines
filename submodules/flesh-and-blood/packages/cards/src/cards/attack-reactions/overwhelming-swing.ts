import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/overwhelming-swing.generated.ts";

export const overwhelmingSwing = definePitchFamily(fabPitchFamilies["overwhelming-swing"], {
  abilities: () => ({
    additionalCostPerDefender: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "asset",
          type: "resources",
          amount: {
            type: "count",
            what: "cards-defending",
            per: "chain-link",
          },
        },
      },
    },
    boostForDefenders: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "sum",
          operands: [
            {
              type: "double",
              operands: [
                {
                  type: "count",
                  what: "cards-defending",
                  per: "chain-link",
                },
              ],
            },
            1,
          ],
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              types: ["Weapon"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  }),
});

export const { yellow: overwhelmingSwingYellow } = overwhelmingSwing.cards;
