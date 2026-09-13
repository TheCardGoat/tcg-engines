import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/second-tenet-of-chi-wind.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const secondTenetOfChiWind = definePitchFamily(
  fabPitchFamilies["second-tenet-of-chi-wind"],
  {
    abilities: () => ({
      veTranscendedTurnGetsGoAgain: {
        kind: "resolution",
        condition: { type: "performed-this-turn", event: "transcend", player: "controller" },
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    }),
  },
);

export const { blue: secondTenetOfChiWindBlue } = secondTenetOfChiWind.cards;
