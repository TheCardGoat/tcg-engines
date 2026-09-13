import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/downswing.generated.ts";

export const downswing = definePitchFamily(fabPitchFamilies["downswing"], {
  abilities: () => ({
    wagerLife: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  subtypes: ["Sword"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
          },
          {
            type: "wager",
            attacker: { selector: "this-attack" },
            prize: {
              type: "lose-life",
              amount: 1,
              target: {
                selector: "winner",
              },
            },
          },
        ],
        outputBinding: "it",
      },
    },
  }),
});

export const { red: downswingRed } = downswing.cards;
