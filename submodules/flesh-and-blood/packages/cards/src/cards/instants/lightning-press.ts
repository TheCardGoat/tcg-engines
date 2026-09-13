import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/lightning-press.generated.ts";

export const lightningPress = definePitchFamily(fabPitchFamilies["lightning-press"], {
  parameters: pitchMap({ red: { amount: 3 }, yellow: { amount: 2 }, blue: { amount: 1 } }),
  abilities: ({ amount }) => ({
    increaseAttackPower: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: attackActionFilter({ cost: { op: "lte", value: 1 } }),
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
  }),
});

export const {
  red: lightningPressRed,
  yellow: lightningPressYellow,
  blue: lightningPressBlue,
} = lightningPress.cards;
