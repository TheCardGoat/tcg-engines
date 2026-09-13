import { spectra } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/arc-light-sentinel.generated.ts";

export const arcLightSentinel = definePitchFamily(fabPitchFamilies["arc-light-sentinel"], {
  keywords: [
    {
      name: "specialization",
      hero: "Prism",
    },
    spectra,
  ],
  abilities: () => ({
    opponentsMustChooseAsTargetAttacksIfAble: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "rule-modification",
        mode: "require",
        action: "be-attacked",
        subject: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const { yellow: arcLightSentinelYellow } = arcLightSentinel.cards;
