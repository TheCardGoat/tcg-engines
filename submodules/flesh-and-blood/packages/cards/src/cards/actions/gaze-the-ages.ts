import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/gaze-the-ages.generated.ts";

import { opt } from "../shared/keywords.ts";

export const gazeTheAges = definePitchFamily(fabPitchFamilies["gaze-the-ages"], {
  keywords: [opt(2)],
  abilities: () => ({
    ifVePlayedAnotherWizardNonAttackActionTurn: {
      kind: "resolution",
      condition: {
        type: "played-this",
        per: "turn",
        filter: {
          typeBox: { supertypes: ["Wizard"], types: ["Action"], excludeSubtypes: ["Attack"] },
        },
        comparison: { op: "gte", value: 2 },
      },
      effect: {
        type: "move-card",
        target: {
          selector: "self",
        },
        to: {
          zone: "hand",
        },
      },
    },
  }),
});
export const { blue: gazeTheAgesBlue } = gazeTheAges.cards;
