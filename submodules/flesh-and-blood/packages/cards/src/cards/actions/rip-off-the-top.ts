import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rip-off-the-top.generated.ts";

export const ripOffTheTop = definePitchFamily(fabPitchFamilies["rip-off-the-top"], {
  keywords: [goAgain],
  abilities: () => ({
    drawThenPitchRandomHand6MorePowerNextAttackTurnGets3Power: {
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
            type: "pitch-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
              random: true,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                power: {
                  op: "gte",
                  value: 6,
                },
              },
            },
            then: {
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
                  or: [{ typeBox: { subtypes: ["Attack"] } }, { typeBox: { types: ["Weapon"] } }],
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const { yellow: ripOffTheTopYellow } = ripOffTheTop.cards;
