import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/dunebreaker-cenipai.generated.ts";
import { goAgain, phantasm } from "../shared/keywords.ts";
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
export const dunebreakerCenipai = definePitchFamily(fabPitchFamilies["dunebreaker-cenipai"], {
  keywords: [phantasm, goAgain],
  abilities: () => ({ ...abilities }),
});
export const {
  red: dunebreakerCenipaiRed,
  yellow: dunebreakerCenipaiYellow,
  blue: dunebreakerCenipaiBlue,
} = dunebreakerCenipai.cards;
