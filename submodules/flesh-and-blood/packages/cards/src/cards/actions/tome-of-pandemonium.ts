import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tome-of-pandemonium.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const tomeOfPandemonium = definePitchFamily(fabPitchFamilies["tome-of-pandemonium"], {
  keywords: [goAgain],
  abilities: () => ({
    banishTopEachHeroSDeckPlayThemTurn: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "each",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "play-card",
            fromZones: ["banished"],
            source: {
              selector: "binding",
              binding: "it",
            },
            duration: "this-turn",
          },
        ],
      },
    },
  }),
});

export const { yellow: tomeOfPandemoniumYellow } = tomeOfPandemonium.cards;
