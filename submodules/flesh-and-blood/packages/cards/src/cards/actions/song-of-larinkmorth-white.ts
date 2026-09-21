import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/song-of-larinkmorth-white.generated.ts";

export const songOfLarinkmorthWhite = definePitchFamily(
  fabPitchFamilies["song-of-larinkmorth-white"],
  {
    abilities: () => ({
      createFrostbiteTokenUnderEachOtherHeroSControl: {
        kind: "resolution",
        effect: {
          type: "create-token",
          token: "frostbite",
          creator: "effect-controller",
          controller: "each-other-hero",
        },
      },
    }),
  },
);

export const { blue: songOfLarinkmorthWhiteBlue } = songOfLarinkmorthWhite.cards;
