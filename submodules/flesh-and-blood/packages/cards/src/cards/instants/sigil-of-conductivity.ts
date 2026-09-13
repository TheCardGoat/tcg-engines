import { arcaneShelter } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/sigil-of-conductivity.generated.ts";

export const sigilOfConductivity = definePitchFamily(fabPitchFamilies["sigil-of-conductivity"], {
  keywords: [arcaneShelter(1)],
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

export const { blue: sigilOfConductivityBlue } = sigilOfConductivity.cards;
