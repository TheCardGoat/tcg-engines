import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/swift-shot.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const swiftShot = definePitchFamily(fabPitchFamilies["swift-shot"], {
  keywords: [goAgain],
  abilities: () => ({
    whenPutFaceUpIntoArsenalGetsGoAgainTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "move-zone",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "face-up",
            },
            bindAs: "it",
          },
          to: "arsenal",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
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
  }),
});

export const { red: swiftShotRed } = swiftShot.cards;
