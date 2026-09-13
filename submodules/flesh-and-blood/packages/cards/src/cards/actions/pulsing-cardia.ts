import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pulsing-cardia.generated.ts";
import { fragment } from "../shared/keywords.ts";

const abilities = {
  triggeredFragmentGainResources: {
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
        type: "gain-resources",
        amount: 1,
      },
    },
  },
} as const;

export const pulsingCardia = definePitchFamily(fabPitchFamilies["pulsing-cardia"], {
  keywords: [fragment],
  abilities: () => ({ ...abilities }),
});

export const {
  red: pulsingCardiaRed,
  yellow: pulsingCardiaYellow,
  blue: pulsingCardiaBlue,
} = pulsingCardia.cards;
