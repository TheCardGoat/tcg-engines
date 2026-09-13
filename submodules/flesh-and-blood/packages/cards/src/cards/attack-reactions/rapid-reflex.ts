import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/rapid-reflex.generated.ts";

export const rapidReflex = definePitchFamily(fabPitchFamilies["rapid-reflex"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    costZeroBoost: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: attackActionFilter({ cost: { op: "eq", value: 0 } }),
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
  }),
});
export const {
  red: rapidReflexRed,
  yellow: rapidReflexYellow,
  blue: rapidReflexBlue,
} = rapidReflex.cards;
