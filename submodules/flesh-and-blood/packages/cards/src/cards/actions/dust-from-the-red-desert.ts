import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dust-from-the-red-desert.generated.ts";

import { phantasm } from "../shared/keywords.ts";

export const dustFromTheRedDesert = definePitchFamily(
  fabPitchFamilies["dust-from-the-red-desert"],
  {
    abilities: () => ({
      whileIsUnderPermanentOtherThanVynserakaiPermanentHas: {
        kind: "static",
        staticKind: "while",
        condition: {
          type: "source-is-subcard-of-host",
          hostOtherThan: "Vynserakai",
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
export const { red: dustFromTheRedDesertRed } = dustFromTheRedDesert.cards;
