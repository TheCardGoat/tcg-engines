import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lay-waste.generated.ts";
import { boost } from "../shared/keywords.ts";

export const layWaste = definePitchFamily(fabPitchFamilies["lay-waste"], {
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

export const { red: layWasteRed, yellow: layWasteYellow, blue: layWasteBlue } = layWaste.cards;
