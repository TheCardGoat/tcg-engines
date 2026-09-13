import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/shove-off.generated.ts";

export const shoveOff = definePitchFamily(fabPitchFamilies["shove-off"], {
  abilities: () => ({
    returnSwordDefender: {
      kind: "resolution",
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              excludeTypes: ["Equipment"],
            },
            defending: true,
            defendingAgainst: {
              typeBox: {
                subtypes: ["Sword"],
              },
            },
          },
          count: 1,
        },
        to: {
          zone: "hand",
        },
      },
    },
  }),
});

export const { blue: shoveOffBlue } = shoveOff.cards;
