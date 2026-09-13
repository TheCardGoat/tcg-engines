import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/diabolic-ultimatum.generated.ts";

export const diabolicUltimatum = definePitchFamily(fabPitchFamilies["diabolic-ultimatum"], {
  abilities: () => ({
    ifAttackActionWasPitchedPlayDiabolicUltimatumEach: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "pitched-attack-action-card-to-play-this",
      },
      effect: {
        type: "for-each",
        target: {
          selector: "each-hero",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "choose-card",
              chooser: "iteration-subject",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "iteration-subject",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Ally"],
                  },
                },
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "destroy",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
          ],
        },
      },
    },
    ifNonAttackActionWasPitchedPlayDiabolicUltimatum: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "pitched-non-attack-action-card-to-play-this",
      },
      effect: {
        type: "for-each",
        target: {
          selector: "each-hero",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "choose-card",
              chooser: "iteration-subject",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "iteration-subject",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                },
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "destroy",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
          ],
        },
      },
    },
  }),
});
export const { red: diabolicUltimatumRed } = diabolicUltimatum.cards;
