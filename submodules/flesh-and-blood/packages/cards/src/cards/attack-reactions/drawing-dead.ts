import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/drawing-dead.generated.ts";

export const drawingDead = definePitchFamily(fabPitchFamilies["drawing-dead"], {
  abilities: () => ({
    wagerDiscard: {
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
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "winner",
                zones: ["hand"],
                count: 1,
              },
            },
          },
        ],
        outputBinding: "it",
      },
    },
  }),
});

export const { yellow: drawingDeadYellow } = drawingDead.cards;
