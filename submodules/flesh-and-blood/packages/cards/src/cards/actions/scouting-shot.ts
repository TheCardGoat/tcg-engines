import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scouting-shot.generated.ts";

export const scoutingShot = definePitchFamily(fabPitchFamilies["scouting-shot"], {
  abilities: () => ({
    whenPutFaceUpIntoArsenalLookAtTopDeck: {
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
          type: "optional",
          effect: {
            type: "look",
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
        },
      },
    },
  }),
});

export const { red: scoutingShotRed } = scoutingShot.cards;
