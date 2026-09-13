import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/demolition-crew.generated.ts";
import { dominate } from "../shared/keywords.ts";

export const demolitionCrew = definePitchFamily(fabPitchFamilies["demolition-crew"], {
  keywords: [dominate],
  abilities: () => ({
    revealCost: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "reveal",
          from: "hand",
          filter: { cost: { op: "gte", value: 2 } },
        },
      },
    },
  }),
});

export const {
  red: demolitionCrewRed,
  yellow: demolitionCrewYellow,
  blue: demolitionCrewBlue,
} = demolitionCrew.cards;
