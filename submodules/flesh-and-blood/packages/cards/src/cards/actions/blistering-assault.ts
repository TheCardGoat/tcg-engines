import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blistering-assault.generated.ts";

const abilities = {
  grantProperty: {
    kind: "resolution",
    condition: {
      type: "pitch-zone-has",
      filter: {
        color: ["yellow"],
      },
    },
    effect: {
      type: "grant-property",
      property: {
        kind: "keyword",
        keyword: {
          name: "go-again",
        },
      },
      target: {
        selector: "self",
      },
      duration: "this-turn",
    },
  },
} as const;

export const blisteringAssault = definePitchFamily(fabPitchFamilies["blistering-assault"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: blisteringAssaultRed,
  yellow: blisteringAssaultYellow,
  blue: blisteringAssaultBlue,
} = blisteringAssault.cards;
