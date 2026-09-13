import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/song-of-the-wandering-mind.generated.ts";

export const songOfTheWanderingMind = definePitchFamily(
  fabPitchFamilies["song-of-the-wandering-mind"],
  {
    abilities: () => ({
      eachOtherHeroDraws: {
        kind: "resolution",
        effect: {
          type: "draw",
          count: 1,
          player: "each-other-hero",
        },
      },
    }),
  },
);

export const { blue: songOfTheWanderingMindBlue } = songOfTheWanderingMind.cards;
