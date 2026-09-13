import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/song-of-sweet-nectar.generated.ts";

export const songOfSweetNectar = definePitchFamily(fabPitchFamilies["song-of-sweet-nectar"], {
  abilities: () => ({
    eachOtherHeroGainsNumber1Life: {
      kind: "resolution",
      effect: {
        type: "gain-life",
        amount: 1,
        target: {
          selector: "each-other-hero",
        },
      },
    },
  }),
});

export const { blue: songOfSweetNectarBlue } = songOfSweetNectar.cards;
