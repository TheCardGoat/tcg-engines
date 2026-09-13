import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/chain-reaction.generated.ts";

export const chainReaction = definePitchFamily(fabPitchFamilies["chain-reaction"], {
  abilities: () => ({
    playArsenalCardAsInstant: {
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
            selector: "defended-attack",
            relationship: {
              kind: "any",
            },
            filter: {
              hasKeyword: "go-again",
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
          type: "optional",
          effect: {
            type: "turn-face-up",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["arsenal"],
              filter: {
                typeBox: {
                  types: ["Action"],
                  excludeSubtypes: ["Attack"],
                },
              },
              count: 1,
            },
            outputBinding: "it",
          },
          // Printed "you may play it this turn as though it were an instant"
          // is a duration grant, never optional wrapping play-card (EVR053).
          then: {
            type: "play-card",
            fromZones: ["arsenal"],
            source: {
              selector: "binding",
              binding: "it",
            },
            duration: "this-turn",
            asType: "instant",
          },
        },
      },
    },
  }),
});

export const { yellow: chainReactionYellow } = chainReaction.cards;
