import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/quickening-sand.generated.ts";

export const quickeningSand = definePitchFamily(fabPitchFamilies["quickening-sand"], {
  keywords: [goAgain],
  abilities: () => ({
    createQuickenTokenTargetHeros: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "quicken",
        controller: "target-controller",
        target: { selector: "any-hero" },
      },
    },
    defendsAttackGoAgainTapTargetAlly: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "defended-attack",
            relationship: {
              kind: "any",
            },
            filter: {
              hasKeyword: "go-again",
            },
          },
          target: {
            kind: "any",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "tap",
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["hero", "permanent"],
            filter: {
              or: [
                {
                  typeBox: {
                    types: ["Hero"],
                  },
                },
                {
                  typeBox: {
                    subtypes: ["Ally"],
                  },
                },
              ],
            },
            count: 1,
          },
        },
      },
    },
  }),
});

export const { blue: quickeningSandBlue } = quickeningSand.cards;
