import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pick-up-the-point.generated.ts";

export const pickUpThePoint = definePitchFamily(fabPitchFamilies["pick-up-the-point"], {
  supertypeSets: [["Assassin"], ["Ninja"]],
  keywords: [goAgain],

  abilities: () => ({
    triggeredAttackOptionalMoveCardSalvage: {
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
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                typeBox: {
                  subtypes: ["Dagger"],
                },
              },
              count: 1,
            },
            to: {
              zone: "hand",
            },
          },
        },
      },
      label: {
        name: "salvage",
      },
    },
  }),
});
export const {
  red: pickUpThePointRed,
  yellow: pickUpThePointYellow,
  blue: pickUpThePointBlue,
} = pickUpThePoint.cards;
