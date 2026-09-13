import { spectra } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/haze-bending.generated.ts";

export const hazeBending = definePitchFamily(fabPitchFamilies["haze-bending"], {
  keywords: [spectra],
  abilities: () => ({
    illusionistNonTokenAuraDestroyedCreateSpectralShieldToken: {
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
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Illusionist"],
                subtypes: ["Aura"],
                excludeMetatypes: ["Token"],
              },
            },
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
      limit: {
        count: 1,
        per: "turn",
      },
    },
  }),
});

export const { blue: hazeBendingBlue } = hazeBending.cards;
