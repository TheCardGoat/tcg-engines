import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/goblet-of-bloodrun-wine.generated.ts";

import { goAgain } from "../shared/keywords.ts";

/**
 * Model notes (hand-authored): printed "Create an Agility and a Vigor token"
 * is two creates, not a synthetic slug "agility-and-a-vigor".
 */
export const gobletOfBloodrunWine = definePitchFamily(fabPitchFamilies["goblet-of-bloodrun-wine"], {
  keywords: [goAgain],
  abilities: () => ({
    createAgilityVigorToken: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "agility",
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
});
export const { blue: gobletOfBloodrunWineBlue } = gobletOfBloodrunWine.cards;
