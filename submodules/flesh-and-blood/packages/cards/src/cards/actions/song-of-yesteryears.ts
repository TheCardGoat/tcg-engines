import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/song-of-yesteryears.generated.ts";

export const songOfYesteryears = definePitchFamily(fabPitchFamilies["song-of-yesteryears"], {
  abilities: () => ({
    eachOtherHeroPutsAttackActionFromTheirGraveyardOnBottomTheir: {
      kind: "resolution",
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "each-other-hero",
          zones: ["graveyard"],
          filter: attackActionFilter(),
          count: 1,
        },
        to: {
          zone: "deck",
          position: "bottom",
        },
      },
    },
  }),
});

export const { blue: songOfYesteryearsBlue } = songOfYesteryears.cards;
