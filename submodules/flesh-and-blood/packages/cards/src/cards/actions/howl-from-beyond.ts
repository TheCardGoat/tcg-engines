import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { bloodDebt, goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/howl-from-beyond.generated.ts";

export const howlFromBeyond = definePitchFamily(fabPitchFamilies["howl-from-beyond"], {
  parameters: { red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } },
  keywords: [goAgain, bloodDebt],
  abilities: ({ value1 }) => ({
    play: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
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
        appliesTo: nextAttackActionLatch(),
      },
    },
  }),
});

export const {
  red: howlFromBeyondRed,
  yellow: howlFromBeyondYellow,
  blue: howlFromBeyondBlue,
} = howlFromBeyond.cards;
