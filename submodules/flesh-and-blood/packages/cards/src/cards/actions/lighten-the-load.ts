import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lighten-the-load.generated.ts";

export const lightenTheLoad = definePitchFamily(fabPitchFamilies["lighten-the-load"], {
  abilities: () => ({
    triggeredAttackOptionalChoiceDiscardDestroyGrantPropertyThisTurn: {
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
            type: "choice",
            options: [
              {
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  filter: {},
                  count: 1,
                },
              },
              {
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: {
                    typeBox: {
                      subtypes: ["Item"],
                    },
                  },
                  count: 1,
                },
              },
            ],
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
      },
    },
  }),
});
export const {
  red: lightenTheLoadRed,
  yellow: lightenTheLoadYellow,
  blue: lightenTheLoadBlue,
} = lightenTheLoad.cards;
