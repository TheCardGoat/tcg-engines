import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/power-play.generated.ts";

export const powerPlay = definePitchFamily(fabPitchFamilies["power-play"], {
  abilities: () => ({
    playedThisModifyNumericPowerThisTurn: {
      kind: "resolution",
      condition: {
        type: "played-this",
        per: "turn",
        onlySource: true,
        filter: { playedFromZones: ["arsenal"] },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 5,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: powerPlayRed, yellow: powerPlayYellow, blue: powerPlayBlue } = powerPlay.cards;
