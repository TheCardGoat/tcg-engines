import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/song-of-the-shining-knight.generated.ts";

export const songOfTheShiningKnight = definePitchFamily(
  fabPitchFamilies["song-of-the-shining-knight"],
  {
    abilities: () => ({
      createMightTokenUnderEachOtherHeroSControl: {
        kind: "resolution",
        effect: {
          type: "create-token",
          token: "might",
          creator: "effect-controller",
          controller: "each-other-hero",
        },
      },
    }),
  },
);

export const { blue: songOfTheShiningKnightBlue } = songOfTheShiningKnight.cards;
