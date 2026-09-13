import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scattering-conflux.generated.ts";
import { fragment } from "../shared/keywords.ts";

export const scatteringConflux = definePitchFamily(fabPitchFamilies["scattering-conflux"], {
  keywords: [fragment],
  abilities: () => ({
    wheneverFragmentsCreateEmbodimentLightningToken: {
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
          token: "embodiment-of-lightning",
          controller: "controller",
        },
      },
    },
  }),
});

export const { red: scatteringConfluxRed } = scatteringConflux.cards;
