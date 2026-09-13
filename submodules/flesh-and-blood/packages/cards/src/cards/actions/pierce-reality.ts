import { spectra } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pierce-reality.generated.ts";

export const pierceReality = definePitchFamily(fabPitchFamilies["pierce-reality"], {
  keywords: [spectra],
  abilities: () => ({
    firstIllusionistAttackActionPlayTurnGets2Power: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Illusionist"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
          ordinal: 1,
        },
      },
    },
  }),
});

export const { blue: pierceRealityBlue } = pierceReality.cards;
