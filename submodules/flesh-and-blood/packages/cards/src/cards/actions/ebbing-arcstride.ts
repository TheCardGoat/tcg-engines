import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ebbing-arcstride.generated.ts";
import { fragment } from "../shared/keywords.ts";
const abilities = {
  gainGoAgainOnFragment: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "fragment",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "source",
          selector: "object",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: {
            name: "go-again",
          },
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  },
} as const;
export const ebbingArcstride = definePitchFamily(fabPitchFamilies["ebbing-arcstride"], {
  keywords: [fragment],
  abilities: () => ({ ...abilities }),
});
export const {
  red: ebbingArcstrideRed,
  yellow: ebbingArcstrideYellow,
  blue: ebbingArcstrideBlue,
} = ebbingArcstride.cards;
