import { overpower } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/burly-bones.generated.ts";

export const burlyBones = definePitchFamily(fabPitchFamilies["burly-bones"], {
  keywords: [overpower],

  abilities: () => ({
    onAttackChoiceDiscardDestroyGrantProperty: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "optional",
              effect: {
                type: "choice",
                options: [
                  {
                    type: "discard",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["hand"],
                      count: 1,
                    },
                  },
                  {
                    type: "destroy",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["deck"],
                      position: "top",
                      count: 1,
                    },
                  },
                ],
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  hasKeyword: "watery-grave",
                },
              },
              then: {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: overpower,
                },
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
  }),
});
export const {
  red: burlyBonesRed,
  yellow: burlyBonesYellow,
  blue: burlyBonesBlue,
} = burlyBones.cards;
