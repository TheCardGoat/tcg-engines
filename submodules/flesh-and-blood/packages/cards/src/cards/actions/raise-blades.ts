import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/raise-blades.generated.ts";

export const raiseBlades = definePitchFamily(fabPitchFamilies["raise-blades"], {
  keywords: [goAgain],
  abilities: () => ({
    drawPutHandTopDeck: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            count: 1,
            player: "controller",
          },
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {},
              count: 1,
            },
            to: {
              zone: "deck",
              position: "top",
            },
          },
        ],
      },
    },
    nextSwordAttackTurnGets3Power: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Sword"],
            },
          },
        },
      },
    },
  }),
});

export const { red: raiseBladesRed } = raiseBlades.cards;
