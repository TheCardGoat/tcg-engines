import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/open-the-center.generated.ts";
import { comboResolution } from "@tcg/flesh-and-blood-types";
import { combo, dominate, goAgain } from "../shared/keywords.ts";

export const openTheCenter = definePitchFamily(fabPitchFamilies["open-the-center"], {
  keywords: [combo],
  abilities: () => ({
    comboResolutionSequenceModifyNumericPowerThisTurnGrantPropertyThisTurnGrantPropertyThisTurn:
      comboResolution({
        names: ["Head Jab"],
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: { selector: "self" },
              duration: "this-turn",
            },
            {
              type: "grant-property",
              property: { kind: "keyword", keyword: goAgain },
              target: { selector: "self" },
              duration: "this-turn",
            },
            {
              type: "grant-property",
              property: { kind: "keyword", keyword: dominate },
              target: { selector: "self" },
              duration: "this-turn",
            },
          ],
        },
      }),
  }),
});

export const {
  red: openTheCenterRed,
  yellow: openTheCenterYellow,
  blue: openTheCenterBlue,
} = openTheCenter.cards;
