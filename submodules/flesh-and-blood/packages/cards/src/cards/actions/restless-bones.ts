import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/restless-bones.generated.ts";

export const restlessBones = definePitchFamily(fabPitchFamilies["restless-bones"], {
  abilities: () => ({
    triggeredAttackSequenceOptionalChoiceDiscardDestroyConditionalBindingMatchesGrantPropertyThisTurn:
      {
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
                      outputBinding: "it",
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
                      outputBinding: "it",
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
                    keyword: goAgain,
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
  red: restlessBonesRed,
  yellow: restlessBonesYellow,
  blue: restlessBonesBlue,
} = restlessBones.cards;
