import { comboResolution } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tempest-palm-gustwave.generated.ts";
import { combo, goAgain } from "../shared/keywords.ts";

export const tempestPalmGustwave = definePitchFamily(fabPitchFamilies["tempest-palm-gustwave"], {
  // Printed go again is only the chain-link-3 resolution clause (CR 8.3.5c).
  keywords: [combo],
  abilities: () => ({
    comboResolution: comboResolution({
      names: ["Surging Strike"],
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    }),
    playedAtChainLinkNumber3HigherGetsGoAgain: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "chain-link-count",
        comparison: { op: "gte", value: 3 },
      },
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
    },
  }),
});

export const { yellow: tempestPalmGustwaveYellow } = tempestPalmGustwave.cards;
