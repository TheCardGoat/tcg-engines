import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/battlefield-blitz.generated.ts";

const abilities = {
  grantProperty: {
    kind: "resolution",
    condition: {
      type: "performed-this-turn",
      event: "charge",
      player: "controller",
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

export const battlefieldBlitz = definePitchFamily(fabPitchFamilies["battlefield-blitz"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: battlefieldBlitzRed,
  yellow: battlefieldBlitzYellow,
  blue: battlefieldBlitzBlue,
} = battlefieldBlitz.cards;
