import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/outed.generated.ts";

export const outed = definePitchFamily(fabPitchFamilies["outed"], {
  keywords: [goAgain],
  abilities: () => ({
    markedCantPlay: {
      kind: "static",
      staticKind: "continuous",
      functionalZones: ["hand"],
      condition: {
        type: "is-marked",
        target: {
          selector: "controller",
        },
      },
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "play",
        filter: {
          name: "Outed",
        },
        duration: "while-condition",
      },
    },
    defendingMarkedGets1Power: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "is-marked",
        target: {
          selector: "defending-hero",
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: outedRed } = outed.cards;
