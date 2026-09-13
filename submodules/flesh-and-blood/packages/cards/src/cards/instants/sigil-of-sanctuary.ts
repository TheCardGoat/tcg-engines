import { arcaneShelter } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/sigil-of-sanctuary.generated.ts";

export const sigilOfSanctuary = definePitchFamily(fabPitchFamilies["sigil-of-sanctuary"], {
  keywords: [arcaneShelter(1)],
  abilities: () => ({
    whenLeavesArenaCreateEmbodimentEarthToken: {
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
          token: "embodiment-of-earth",
          controller: "controller",
        },
      },
    },
  }),
});

export const { blue: sigilOfSanctuaryBlue } = sigilOfSanctuary.cards;
