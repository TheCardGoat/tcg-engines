import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/jack-o-lantern.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const jackOLantern = definePitchFamily(fabPitchFamilies["jack-o-lantern"], {
  parameters: { red: "red", yellow: "yellow", blue: "blue" },
  keywords: [goAgain],
  abilities: (color) => ({
    sequenceBanishConditionalBindingMatchesCreateTokenRunechant: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
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
                color: [color],
              },
            },
            then: {
              type: "create-token",
              token: "runechant",
              controller: "controller",
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: jackOLanternRed,
  yellow: jackOLanternYellow,
  blue: jackOLanternBlue,
} = jackOLantern.cards;
