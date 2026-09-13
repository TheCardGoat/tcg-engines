import { createToken } from "@tcg/flesh-and-blood-types";
import { bloodDebt, goAgain, opt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/enshrine-sin.generated.ts";

export const enshrineSin = definePitchFamily(fabPitchFamilies["enshrine-sin"], {
  parameters: {
    red: { banishedSurcharge: 1 },
    yellow: { banishedSurcharge: 2 },
    blue: { banishedSurcharge: 3 },
  },
  keywords: [opt(1), goAgain, bloodDebt],
  abilities: ({ banishedSurcharge }) => ({
    banishedPermission: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
        costModification: { increase: banishedSurcharge },
      },
    },
    optThenCreateRunechant: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "opt",
            count: 1,
          },
          createToken("runechant"),
        ],
      },
    },
  }),
});

export const {
  red: enshrineSinRed,
  yellow: enshrineSinYellow,
  blue: enshrineSinBlue,
} = enshrineSin.cards;
