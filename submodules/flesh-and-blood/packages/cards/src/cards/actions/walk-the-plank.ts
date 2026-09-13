import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/walk-the-plank.generated.ts";

export const walkThePlank = definePitchFamily(fabPitchFamilies["walk-the-plank"], {
  abilities: () => ({
    triggeredStaticOnHitEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Pirate"],
              },
            },
          },
          target: {
            kind: "hero",
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
            player: "opponent",
            zones: ["hero", "permanent"],
            count: 1,
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
          },
        },
      },
    },
  }),
});

export const {
  red: walkThePlankRed,
  yellow: walkThePlankYellow,
  blue: walkThePlankBlue,
} = walkThePlank.cards;
