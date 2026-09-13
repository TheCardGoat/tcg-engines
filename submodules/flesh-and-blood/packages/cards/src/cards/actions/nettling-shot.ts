import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/nettling-shot.generated.ts";

export const nettlingShot = definePitchFamily(fabPitchFamilies["nettling-shot"], {
  abilities: () => ({
    putFaceUpArsenalTapTargetAlly: {
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
            type: "tap",
            target: {
              selector: "object",
              declared: "at-resolution",
              // The nettled ally belongs to the opposing hero.
              player: "opponent",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
              count: 1,
            },
          },
        },
      },
    },
  }),
});

export const { red: nettlingShotRed } = nettlingShot.cards;
