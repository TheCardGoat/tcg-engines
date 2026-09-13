import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/codex-of-inertia.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const codexOfInertia = definePitchFamily(fabPitchFamilies["codex-of-inertia"], {
  keywords: [goAgain],
  abilities: () => ({
    eachHeroPutsTopTheirDeckFaceDownInto: {
      kind: "resolution",
      effect: {
        type: "for-each",
        target: {
          selector: "each-hero",
        },
        effect: {
          type: "if-you-do",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "iteration-subject",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            to: {
              zone: "arsenal",
              visibility: "face-down",
            },
          },
          then: {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "iteration-subject",
              zones: ["hand"],
              count: 1,
            },
          },
        },
      },
    },
    createPonderTokenUnderControlInertiaTokenUnderEach: {
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
            token: "inertia",
            controller: "opponent",
          },
        ],
      },
    },
  }),
});
export const { yellow: codexOfInertiaYellow } = codexOfInertia.cards;
