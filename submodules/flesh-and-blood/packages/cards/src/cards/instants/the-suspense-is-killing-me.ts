import { suspense } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/the-suspense-is-killing-me.generated.ts";

export const theSuspenseIsKillingMe = definePitchFamily(
  fabPitchFamilies["the-suspense-is-killing-me"],
  {
    keywords: [suspense],
    abilities: () => ({
      firstAttackEachTurnGets1: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "while-in-arena",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
          },
        },
      },
    }),
  },
);

export const { blue: theSuspenseIsKillingMeBlue } = theSuspenseIsKillingMe.cards;
