import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tap-lessons-past.generated.ts";

export const tapLessonsPast = definePitchFamily(fabPitchFamilies["tap-lessons-past"], {
  abilities: (_parameter, { pitch }) => ({
    resolutionDealDamage: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 5 - Number(pitch),
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
    },
    resolutionOptional: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "this-dealt-damage",
      },
      effect: {
        type: "optional",
        effect: {
          type: "tap",
          target: {
            selector: "controller",
          },
        },
        then: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["graveyard"],
            filter: {
              typeBox: {
                types: ["Instant"],
              },
            },
            count: 1,
          },
          to: {
            zone: "deck",
            position: "bottom",
          },
        },
      },
    },
  }),
});

export const {
  red: tapLessonsPastRed,
  yellow: tapLessonsPastYellow,
  blue: tapLessonsPastBlue,
} = tapLessonsPast.cards;
