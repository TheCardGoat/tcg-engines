import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blast-rig.generated.ts";

import { boost } from "../shared/keywords.ts";

export const blastRig = definePitchFamily(fabPitchFamilies["blast-rig"], {
  keywords: [boost],
  abilities: () => ({
    gets1EachEvoHaveEquipped: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "equipped-objects",
          player: "controller",
          filter: {
            typeBox: {
              subtypes: ["Evo"],
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
      label: {
        name: "evo-upgrade",
      },
    },
  }),
});
export const { red: blastRigRed } = blastRig.cards;
