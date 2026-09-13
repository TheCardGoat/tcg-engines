import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/surface-shaking.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const surfaceShaking = definePitchFamily(fabPitchFamilies["surface-shaking"], {
  keywords: [goAgain],
  abilities: () => ({
    whenEntersArenaCreateNumber3SeismicSurgeTokens: {
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
          type: "create-token",
          token: "seismic-surge",
          controller: "controller",
          count: 3,
        },
      },
    },
    atBeginningActionPhaseDestroyPutUpXFromHandOnBottom: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
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
              type: "optional",
              effect: {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  count: {
                    type: "count",
                    what: "cards-in-zone",
                    zone: "permanent",
                    player: "controller",
                    filter: {
                      name: "Seismic Surge",
                      typeBox: {
                        metatypes: ["Token"],
                      },
                    },
                  },
                },
                to: {
                  zone: "deck",
                  position: "bottom",
                },
              },
            },
            {
              type: "draw",
              count: {
                type: "count",
                what: "put-on-bottom-this-way",
              },
              player: "controller",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: surfaceShakingBlue } = surfaceShaking.cards;
