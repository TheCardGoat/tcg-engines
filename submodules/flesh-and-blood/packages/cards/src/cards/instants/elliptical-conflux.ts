import { ward } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/elliptical-conflux.generated.ts";

export const ellipticalConflux = definePitchFamily(fabPitchFamilies["elliptical-conflux"], {
  keywords: [ward(2)],
  abilities: () => ({
    whenLeavesArenaCreateEmbodimentLightningToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
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

export const { yellow: ellipticalConfluxYellow } = ellipticalConflux.cards;
