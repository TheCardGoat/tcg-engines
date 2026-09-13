import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/seek-vengeance.generated.ts";
import { comboResolution } from "@tcg/flesh-and-blood-types";
import { combo, goAgain } from "../shared/keywords.ts";

export const seekVengeance = definePitchFamily(fabPitchFamilies["seek-vengeance"], {
  keywords: [combo],
  abilities: () => ({
    gainGoAgainAfterEdgeOfAutumn: comboResolution({
      names: ["Edge Of Autumn"],
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
});

export const { blue: seekVengeanceBlue, red: seekVengeanceRed } = seekVengeance.cards;
