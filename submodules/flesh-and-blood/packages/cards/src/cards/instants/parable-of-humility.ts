import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { spectra } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/parable-of-humility.generated.ts";

export const parableOfHumility = definePitchFamily(fabPitchFamilies["parable-of-humility"], {
  keywords: [spectra],
  abilities: () => ({
    attackActionOpponentsControlGet1WhileAttackingDefending: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "subtract",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["combat-chain", "stack"],
          filter: attackActionFilter(),
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const { yellow: parableOfHumilityYellow } = parableOfHumility.cards;
