import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/line.generated.ts";

export const line = definePitchFamily(fabPitchFamilies["line"], {
  keywords: [goAgain],
  abilities: () => ({
    lookTopDeckArrowPutFaceUpArsenalGetsGoAgainTurn: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                typeBox: {
                  subtypes: ["Arrow"],
                },
              },
            },
            then: {
              type: "optional",
              effect: {
                type: "move-card",
                target: {
                  selector: "binding",
                  binding: "it",
                },
                to: {
                  zone: "arsenal",
                  visibility: "face-up",
                },
                outputBinding: "it",
              },
              then: {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: goAgain,
                },
                target: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-turn",
              },
            },
          },
        ],
      },
    },
  }),
});

export const { blue: lineBlue } = line.cards;
