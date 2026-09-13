import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/heat-seeker.generated.ts";

export const heatSeeker = definePitchFamily(fabPitchFamilies["heat-seeker"], {
  abilities: () => ({
    hitsBeginningEndPhasePutTopDeckFaceUpArsenal: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
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
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "end-phase",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "first",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              to: {
                zone: "arsenal",
                visibility: "face-up",
              },
            },
          },
        },
      },
    },
  }),
});

export const { red: heatSeekerRed } = heatSeeker.cards;
