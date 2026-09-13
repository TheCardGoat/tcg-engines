import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/angry-bones.generated.ts";

export const angryBones = definePitchFamily(fabPitchFamilies["angry-bones"], {
  abilities: () => ({
    onAttackChoiceDiscardDestroyModifyNumericPower: {
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
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
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
  red: angryBonesRed,
  yellow: angryBonesYellow,
  blue: angryBonesBlue,
} = angryBones.cards;
