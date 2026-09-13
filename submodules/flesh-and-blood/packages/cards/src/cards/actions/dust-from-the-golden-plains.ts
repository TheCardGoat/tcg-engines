import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dust-from-the-golden-plains.generated.ts";

import { phantasm } from "../shared/keywords.ts";

export const dustFromTheGoldenPlains = definePitchFamily(
  fabPitchFamilies["dust-from-the-golden-plains"],
  {
    abilities: () => ({
      whileIsUnderPermanentOtherThanThemaiPermanentHas: {
        kind: "static",
        staticKind: "while",
        condition: {
          type: "source-is-subcard-of-host",
          hostOtherThan: "Themai",
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
export const { red: dustFromTheGoldenPlainsRed } = dustFromTheGoldenPlains.cards;
