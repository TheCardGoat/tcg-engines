import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/snap-shot.generated.ts";

export const snapShot = definePitchFamily(fabPitchFamilies["snap-shot"], {
  parameters: pitchMap({ red: {}, yellow: {}, blue: {} }),
  keywords: [fusion("Lightning")],
  abilities: () => ({
    resolutionRuleModification: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "rule-modification",
        mode: "allow",
        action: "activate",
        filter: {
          typeBox: {
            subtypes: ["Bow"],
          },
          hasStatus: "activate-additional-as-instant",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: snapShotRed, yellow: snapShotYellow, blue: snapShotBlue } = snapShot.cards;
