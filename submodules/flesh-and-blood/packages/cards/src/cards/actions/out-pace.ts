import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/out-pace.generated.ts";
import { boost } from "../shared/keywords.ts";

export const outPace = definePitchFamily(fabPitchFamilies["out-pace"], {
  keywords: [boost],
  abilities: () => ({
    ruleModificationRestrictDefendThisCombatChain: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "defend",
        filter: {
          typeBox: {
            types: ["Equipment"],
          },
        },
        duration: "this-combat-chain",
      },
    },
  }),
});

export const { red: outPaceRed, yellow: outPaceYellow, blue: outPaceBlue } = outPace.cards;
