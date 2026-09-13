import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/phantasmal-haze.generated.ts";
import { phantasm } from "../shared/keywords.ts";

const abilities = {
  triggeredDestroyCreateTokenSpectralShield: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "destroy",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "none",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "create-token",
        token: "spectral-shield",
        controller: "controller",
      },
    },
  },
} as const;

export const phantasmalHaze = definePitchFamily(fabPitchFamilies["phantasmal-haze"], {
  keywords: [phantasm],
  abilities: () => ({ ...abilities }),
});

export const {
  red: phantasmalHazeRed,
  yellow: phantasmalHazeYellow,
  blue: phantasmalHazeBlue,
} = phantasmalHaze.cards;
