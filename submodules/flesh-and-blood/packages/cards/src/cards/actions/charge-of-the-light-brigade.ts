import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/charge-of-the-light-brigade.generated.ts";

export const chargeOfTheLightBrigade = definePitchFamily(
  fabPitchFamilies["charge-of-the-light-brigade"],
  {
    keywords: [goAgain],
    abilities: () => ({
      modifyNumericPower: {
        kind: "resolution",

        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 3,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
              hasStatus: "charged-to-play",
            },
          },
        },
      },
    }),
  },
);

export const {
  red: chargeOfTheLightBrigadeRed,
  yellow: chargeOfTheLightBrigadeYellow,
  blue: chargeOfTheLightBrigadeBlue,
} = chargeOfTheLightBrigade.cards;
