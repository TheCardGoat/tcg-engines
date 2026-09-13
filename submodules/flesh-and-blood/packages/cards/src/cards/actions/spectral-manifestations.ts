import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spectral-manifestations.generated.ts";
import { goAgain } from "../shared/keywords.ts";

const abilities = {
  resolutionSequence: {
    kind: "resolution",
    effect: {
      type: "sequence",
      steps: [
        {
          type: "create-token",
          token: "spectral-shield",
          controller: "controller",
        },
        {
          type: "conditional",
          condition: {
            type: "zone-count",
            zone: "permanent",
            player: "controller",
            filter: {
              typeBox: {
                supertypes: ["Illusionist"],
                subtypes: ["Aura"],
              },
            },
            comparison: {
              op: "eq",
              value: 1,
            },
          },
          then: {
            type: "add-counter",
            counter: {
              kind: "numeric",
              value: 1,
              property: "power",
            },
            count: 3,
            target: {
              selector: "self",
            },
          },
        },
      ],
    },
  },
} as const;

export const spectralManifestations = definePitchFamily(
  fabPitchFamilies["spectral-manifestations"],
  {
    keywords: [goAgain],
    abilities: () => abilities,
  },
);

export const {
  red: spectralManifestationsRed,
  yellow: spectralManifestationsYellow,
  blue: spectralManifestationsBlue,
} = spectralManifestations.cards;
