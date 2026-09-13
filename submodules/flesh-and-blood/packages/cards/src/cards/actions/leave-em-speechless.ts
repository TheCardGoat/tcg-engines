import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/leave-em-speechless.generated.ts";

export const leaveEmSpeechless = definePitchFamily(fabPitchFamilies["leave-em-speechless"], {
  abilities: () => ({
    moreLifeThanOtherPlayThoughWereInstant: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "life-comparison",
        player: "self",
        vs: "each-other-hero",
        op: "gt",
      },
      playEffect: {
        role: "permission",
        fromZones: ["hand", "arsenal"],
        asType: "instant",
        optional: true,
      },
    },
    entersArenaNameNamedCantPlayedHandArena: {
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
              type: "name-card",
              suggestions: ["visible-cards"],
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "play",
              filter: {
                // The continuous-effect compiler resolves this declaration
                // sentinel to the concrete name while the layer binding is
                // still available. Rules-view legality intentionally has no
                // access to stale stack bindings.
                name: "chosen",
                playedFromZones: ["hand"],
              },
              duration: "while-in-arena",
            },
          ],
        },
      },
    },
    beginningActionPhaseDestroy: {
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
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});

export const { blue: leaveEmSpeechlessBlue } = leaveEmSpeechless.cards;
