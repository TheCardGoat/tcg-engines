import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pint-of-strong-and-stout.generated.ts";

export const pintOfStrongAndStout = definePitchFamily(
  fabPitchFamilies["pint-of-strong-and-stout"],
  {
    keywords: [goAgain],
    abilities: () => ({
      createMightVigorToken: {
        kind: "resolution",
        // Two separate tokens (TCC105 Might / TCC107 Vigor), not a compound
        // slug — authoring shape: LGS355 sequence of create-token steps.
        effect: {
          type: "sequence",
          steps: [
            {
              type: "create-token",
              token: "might",
              controller: "controller",
            },
            {
              type: "create-token",
              token: "vigor",
              controller: "controller",
            },
          ],
        },
      },
    }),
  },
);

export const { blue: pintOfStrongAndStoutBlue } = pintOfStrongAndStout.cards;
