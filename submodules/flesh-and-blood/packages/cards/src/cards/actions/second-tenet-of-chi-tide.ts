import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/second-tenet-of-chi-tide.generated.ts";

export const secondTenetOfChiTide = definePitchFamily(
  fabPitchFamilies["second-tenet-of-chi-tide"],
  {
    abilities: () => ({
      veTranscendedTurnGetsNumber2Power: {
        kind: "resolution",
        condition: { type: "performed-this-turn", event: "transcend", player: "controller" },
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    }),
  },
);

export const { blue: secondTenetOfChiTideBlue } = secondTenetOfChiTide.cards;
