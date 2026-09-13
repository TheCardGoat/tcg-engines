import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spellblade-strike.generated.ts";

export const spellbladeStrike = definePitchFamily(fabPitchFamilies["spellblade-strike"], {
  abilities: () => ({
    resolutionCreateToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "runechant",
        controller: "controller",
      },
    },
  }),
});

export const {
  red: spellbladeStrikeRed,
  yellow: spellbladeStrikeYellow,
  blue: spellbladeStrikeBlue,
} = spellbladeStrike.cards;
