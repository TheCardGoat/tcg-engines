import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rise-from-the-ashes.generated.ts";

export const riseFromTheAshes = definePitchFamily(fabPitchFamilies["rise-from-the-ashes"], {
  parameters: { red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } },
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    modifyNumericPowerThisTurn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: value1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch({
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
      },
    },
    optionalMoveCardPhoenixFlame: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["graveyard"],
            filter: {
              name: "Phoenix Flame",
            },
            count: 1,
          },
          to: {
            zone: "hand",
          },
        },
      },
    },
  }),
});

export const {
  red: riseFromTheAshesRed,
  yellow: riseFromTheAshesYellow,
  blue: riseFromTheAshesBlue,
} = riseFromTheAshes.cards;
