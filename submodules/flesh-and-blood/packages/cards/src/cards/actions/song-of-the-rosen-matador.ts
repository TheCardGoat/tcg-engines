import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/song-of-the-rosen-matador.generated.ts";

export const songOfTheRosenMatador = definePitchFamily(
  fabPitchFamilies["song-of-the-rosen-matador"],
  {
    abilities: () => ({
      createVigorTokenUnderEachOtherHeroSControl: {
        kind: "resolution",
        effect: {
          type: "create-token",
          token: "vigor",
          controller: "each-other-hero",
        },
      },
    }),
  },
);

export const { blue: songOfTheRosenMatadorBlue } = songOfTheRosenMatador.cards;
