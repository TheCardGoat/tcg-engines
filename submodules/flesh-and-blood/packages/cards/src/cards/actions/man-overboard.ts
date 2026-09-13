import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/man-overboard.generated.ts";

export const manOverboard = definePitchFamily(fabPitchFamilies["man-overboard"], {
  keywords: [goAgain],

  abilities: () => ({
    triggeredAttackOptionalDiscardSequenceModifyNumericPowerPermanentGrantPropertyPermanent: {
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
          type: "optional",
          effect: {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
              count: 1,
            },
            outputBinding: "it",
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
                target: {
                  selector: "self",
                },
                duration: "permanent",
              },
              {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: goAgain,
                },
                target: {
                  selector: "self",
                },
                duration: "permanent",
              },
            ],
          },
        },
      },
    },
  }),
});
export const {
  red: manOverboardRed,
  yellow: manOverboardYellow,
  blue: manOverboardBlue,
} = manOverboard.cards;
