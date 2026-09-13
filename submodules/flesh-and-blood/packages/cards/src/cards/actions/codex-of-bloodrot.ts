import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/codex-of-bloodrot.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const codexOfBloodrot = definePitchFamily(fabPitchFamilies["codex-of-bloodrot"], {
  keywords: [goAgain],
  abilities: () => ({
    eachHeroPutsFromTheirHandFaceDownInto: {
      kind: "resolution",
      effect: {
        type: "for-each",
        target: {
          selector: "each-hero",
        },
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "iteration-subject",
            zones: ["hand"],
            count: 1,
          },
          to: {
            zone: "arsenal",
            visibility: "face-down",
          },
        },
      },
    },
    createPonderTokenUnderControlBloodrotPoxTokenUnder: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "ponder",
            controller: "controller",
          },
          {
            type: "create-token",
            token: "bloodrot-pox",
            controller: "opponent",
          },
        ],
      },
    },
  }),
});
export const { yellow: codexOfBloodrotYellow } = codexOfBloodrot.cards;
