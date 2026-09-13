import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/embermaw-cenipai.generated.ts";
import { phantasm } from "../shared/keywords.ts";
const abilities = {
  onDestroyCreateTokenAsh: {
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
        token: "ash",
        controller: "controller",
      },
    },
  },
} as const;
export const embermawCenipai = definePitchFamily(fabPitchFamilies["embermaw-cenipai"], {
  keywords: [phantasm],
  abilities: () => ({ ...abilities }),
});
export const {
  red: embermawCenipaiRed,
  yellow: embermawCenipaiYellow,
  blue: embermawCenipaiBlue,
} = embermawCenipai.cards;
