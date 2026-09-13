import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hook.generated.ts";

export const hook = definePitchFamily(fabPitchFamilies["hook"], {
  keywords: [goAgain],
  abilities: () => ({
    lookTopDeckArrowPutFaceUpArsenalGets1PowerTurn: {
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
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
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

export const { blue: hookBlue } = hook.cards;
