import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/razor-s-edge.generated.ts";

export const razorSEdge = definePitchFamily(fabPitchFamilies["razor-s-edge"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    stealthBoost: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: attackActionFilter({ hasKeyword: "stealth" }),
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
  }),
});
export const {
  red: razorSEdgeRed,
  yellow: razorSEdgeYellow,
  blue: razorSEdgeBlue,
} = razorSEdge.cards;
