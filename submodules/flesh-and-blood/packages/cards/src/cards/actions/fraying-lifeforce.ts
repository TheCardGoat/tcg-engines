import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fraying-lifeforce.generated.ts";

import { fragment } from "../shared/keywords.ts";

export const frayingLifeforce = definePitchFamily(fabPitchFamilies["fraying-lifeforce"], {
  keywords: [fragment],
  abilities: () => ({
    wheneverFragmentsGain1: {
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
          type: "gain-life",
          amount: 1,
          target: {
            selector: "controller",
          },
        },
      },
    },
  }),
});
export const { red: frayingLifeforceRed } = frayingLifeforce.cards;
