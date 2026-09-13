import { phantasm, spectra } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/passing-mirage.generated.ts";

export const passingMirage = definePitchFamily(fabPitchFamilies["passing-mirage"], {
  keywords: [spectra],
  abilities: () => ({
    firstIllusionistAttackTurnLosesCantGetPhantasm: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-property",
            property: {
              kind: "keyword",
              keyword: phantasm,
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Illusionist"],
                },
              },
              ordinal: 1,
            },
          },
          {
            type: "rule-modification",
            mode: "restrict",
            action: "gain-keyword",
            filter: {
              hasKeyword: "phantasm",
              typeBox: {
                supertypes: ["Illusionist"],
              },
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Illusionist"],
                },
              },
              ordinal: 1,
            },
          },
        ],
      },
    },
  }),
});

export const { blue: passingMirageBlue } = passingMirage.cards;
