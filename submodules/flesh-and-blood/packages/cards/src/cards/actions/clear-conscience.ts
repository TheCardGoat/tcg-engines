import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/clear-conscience.generated.ts";

import { fragment } from "../shared/keywords.ts";

const abilities = {
  onHitMoveCardCreateTokenPonder: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "hit",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "attack",
        },
        target: {
          kind: "hero",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "for-each",
        target: {
          selector: "each-hero",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                zones: ["hand"],
                count: 1,
              },
              to: {
                zone: "deck",
                position: "bottom",
              },
            },
            {
              type: "create-token",
              token: "ponder",
              creator: "token-controller",
              controller: "each",
            },
          ],
        },
      },
    },
  },
} as const;

export const clearConscience = definePitchFamily(fabPitchFamilies["clear-conscience"], {
  keywords: [fragment],
  abilities: () => ({ ...abilities }),
});

export const {
  red: clearConscienceRed,
  yellow: clearConscienceYellow,
  blue: clearConscienceBlue,
} = clearConscience.cards;
