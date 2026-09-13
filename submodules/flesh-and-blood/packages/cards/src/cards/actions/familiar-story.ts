import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/familiar-story.generated.ts";

export const familiarStory = definePitchFamily(fabPitchFamilies["familiar-story"], {
  abilities: () => ({
    when1MoreGuardianDefendCreateConfidenceToken: {
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
            selector: "defender",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Guardian"],
              },
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
          type: "create-token",
          token: "confidence",
          controller: "controller",
        },
      },
    },
  }),
});
export const { red: familiarStoryRed } = familiarStory.cards;
