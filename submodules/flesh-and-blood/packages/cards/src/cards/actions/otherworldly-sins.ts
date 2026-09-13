import { createToken, plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/otherworldly-sins.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const otherworldlySins = definePitchFamily(fabPitchFamilies["otherworldly-sins"], {
  parameters: { red: 3, yellow: 2, blue: 1 },
  keywords: [goAgain],
  abilities: (amount) => ({
    power: plusPower(amount, {
      appliesTo: {
        next: {
          or: [{ typeBox: { supertypes: ["Runeblade"] } }, { typeBox: { supertypes: ["Shadow"] } }],
          typeBox: { subtypes: ["Attack"] },
        },
      },
    }),
    runechant: createToken("runechant"),
  }),
});

export const {
  red: otherworldlySinsRed,
  yellow: otherworldlySinsYellow,
  blue: otherworldlySinsBlue,
} = otherworldlySins.cards;
