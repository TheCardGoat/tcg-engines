import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dust-from-the-chrome-caverns.generated.ts";

import { phantasm } from "../shared/keywords.ts";

export const dustFromTheChromeCaverns = definePitchFamily(
  fabPitchFamilies["dust-from-the-chrome-caverns"],
  {
    abilities: () => ({
      whileIsUnderPermanentOtherThanCromaiPermanentHas: {
        kind: "static",
        staticKind: "while",
        condition: {
          type: "source-is-subcard-of-host",
          hostOtherThan: "Cromai",
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
export const { red: dustFromTheChromeCavernsRed } = dustFromTheChromeCaverns.cards;
