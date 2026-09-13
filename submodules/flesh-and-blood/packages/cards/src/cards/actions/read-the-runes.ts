import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/read-the-runes.generated.ts";

export const readTheRunes = definePitchFamily(fabPitchFamilies["read-the-runes"], {
  parameters: { red: 3, yellow: 2, blue: 1 },
  abilities: (count) => ({
    createTokenRunechant: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "runechant",
        controller: "controller",
        count,
      },
    },
  }),
});

export const {
  red: readTheRunesRed,
  yellow: readTheRunesYellow,
  blue: readTheRunesBlue,
} = readTheRunes.cards;
