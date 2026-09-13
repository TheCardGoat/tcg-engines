import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/jagged-edge.generated.ts";

export const jaggedEdge = definePitchFamily(fabPitchFamilies["jagged-edge"], {
  abilities: () => ({
    boostAndPreventDamagePrevention: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
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
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                id: "damageCannotBePrevented",
                text: "",
                kind: "static",
                staticKind: "continuous",
                effect: {
                  type: "rule-modification",
                  mode: "restrict",
                  action: "be-prevented",
                  duration: "this-chain-link",
                },
              },
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
          },
        ],
        outputBinding: "it",
      },
    },
  }),
});

export const { red: jaggedEdgeRed } = jaggedEdge.cards;
