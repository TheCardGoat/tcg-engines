import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shattering-flowtide.generated.ts";
import { fragment } from "../shared/keywords.ts";

const abilities = {
  triggeredEffect: {
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
        type: "create-token",
        token: "lightning-flow",
        controller: "controller",
      },
    },
  },
} as const;

export const shatteringFlowtide = definePitchFamily(fabPitchFamilies["shattering-flowtide"], {
  keywords: [fragment],
  abilities: () => abilities,
});

export const {
  red: shatteringFlowtideRed,
  yellow: shatteringFlowtideYellow,
  blue: shatteringFlowtideBlue,
} = shatteringFlowtide.cards;
