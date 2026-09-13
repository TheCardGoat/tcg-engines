import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dust-from-the-fertile-fields.generated.ts";

import { phantasm } from "../shared/keywords.ts";

export const dustFromTheFertileFields = definePitchFamily(
  fabPitchFamilies["dust-from-the-fertile-fields"],
  {
    abilities: () => ({
      whileIsUnderPermanentOtherThanOuviaPermanentGets: {
        kind: "static",
        staticKind: "while",
        condition: {
          type: "source-is-subcard-of-host",
          hostOtherThan: "Ouvia",
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
export const { red: dustFromTheFertileFieldsRed } = dustFromTheFertileFields.cards;
