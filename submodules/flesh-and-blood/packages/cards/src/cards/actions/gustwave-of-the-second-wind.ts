import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/gustwave-of-the-second-wind.generated.ts";

import { comboResolution } from "@tcg/flesh-and-blood-types";

import { combo, goAgain } from "../shared/keywords.ts";

export const gustwaveOfTheSecondWind = definePitchFamily(
  fabPitchFamilies["gustwave-of-the-second-wind"],
  {
    keywords: [combo],
    abilities: () => ({
      surgingStrikeComboGoAgain: comboResolution({
        names: ["Surging Strike"],
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      }),
    }),
  },
);
export const { red: gustwaveOfTheSecondWindRed } = gustwaveOfTheSecondWind.cards;
