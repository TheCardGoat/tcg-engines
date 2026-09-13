import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/song-of-jack-be-quick.generated.ts";

export const songOfJackBeQuick = definePitchFamily(fabPitchFamilies["song-of-jack-be-quick"], {
  abilities: () => ({
    createQuickenTokenUnderEachOtherHeroSControl: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "quicken",
        controller: "each-other-hero",
      },
    },
  }),
});

export const { blue: songOfJackBeQuickBlue } = songOfJackBeQuick.cards;
