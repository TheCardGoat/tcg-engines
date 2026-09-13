import { comboStatic } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/fluster-fist.generated.ts";
import { combo } from "../shared/keywords.ts";
const abilities = {
  comboPowerScaling: comboStatic({
    names: ["Open The Center"],
    effect: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: {
        type: "count",
        what: "attacks-hit-this-combat-chain",
      },
      target: {
        selector: "self",
      },
      duration: "while-in-arena",
    },
  }),
} as const;
export const flusterFist = definePitchFamily(fabPitchFamilies["fluster-fist"], {
  keywords: [combo],
  abilities: () => ({ ...abilities }),
});
export const {
  red: flusterFistRed,
  yellow: flusterFistYellow,
  blue: flusterFistBlue,
} = flusterFist.cards;
