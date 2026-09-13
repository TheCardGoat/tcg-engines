import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dust-from-the-shadow-crypts.generated.ts";

import { phantasm } from "../shared/keywords.ts";

export const dustFromTheShadowCrypts = definePitchFamily(
  fabPitchFamilies["dust-from-the-shadow-crypts"],
  {
    abilities: () => ({
      whileIsUnderPermanentOtherThanNekriaPermanentHas: {
        kind: "static",
        staticKind: "while",
        condition: {
          type: "source-is-subcard-of-host",
          hostOtherThan: "Nekria",
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: phantasm,
          },
          target: {
            selector: "host",
          },
          duration: "while-condition",
        },
        label: {
          name: "material",
        },
      },
    }),
  },
);
export const { red: dustFromTheShadowCryptsRed } = dustFromTheShadowCrypts.cards;
