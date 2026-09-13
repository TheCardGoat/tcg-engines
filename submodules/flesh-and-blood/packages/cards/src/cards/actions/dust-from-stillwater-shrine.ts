import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dust-from-stillwater-shrine.generated.ts";

import { phantasm } from "../shared/keywords.ts";

export const dustFromStillwaterShrine = definePitchFamily(
  fabPitchFamilies["dust-from-stillwater-shrine"],
  {
    abilities: () => ({
      whileIsUnderPermanentOtherThanMiragaiPermanentHas: {
        kind: "static",
        staticKind: "while",
        condition: {
          type: "source-is-subcard-of-host",
          hostOtherThan: "Miragai",
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
export const { red: dustFromStillwaterShrineRed } = dustFromStillwaterShrine.cards;
