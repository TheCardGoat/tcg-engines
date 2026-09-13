import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/distant-rumbling.generated.ts";
export const distantRumbling = definePitchFamily(fabPitchFamilies["distant-rumbling"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    staticTriggeredEnterArenaSequence: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              count: 1,
              player: "controller",
            },
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                count: 1,
              },
              to: {
                zone: "deck",
                position: {
                  index: 5,
                },
              },
            },
          ],
        },
      },
    },
    staticTriggeredStartPhaseSequence: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "create-token",
              token: "seismic-surge",
              controller: "controller",
              count: amount,
            },
          ],
        },
      },
    },
  }),
});
export const {
  red: distantRumblingRed,
  yellow: distantRumblingYellow,
  blue: distantRumblingBlue,
} = distantRumbling.cards;
