import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/remorseless.generated.ts";

export const remorseless = definePitchFamily(fabPitchFamilies["remorseless"], {
  abilities: () => ({
    putArsenalFaceUpEndTurnGainsDefenseReactionCantPlayedArsenalRemoreselesssChainLink: {
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
            kind: "ability",
            ability: {
              id: "defenseReactionCantPlayedArsenalRemoreselesssChainLink",
              text: "",
              kind: "resolution",
              effect: {
                type: "rule-modification",
                mode: "restrict",
                action: "play",
                filter: {
                  typeBox: { types: ["Defense Reaction"] },
                  playedFromZones: ["arsenal"],
                },
                duration: "this-chain-link",
              },
            },
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
    remorselessHitsEndNextTurnWheneverPlayActionLose1Life: {
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
          target: {
            kind: "hero",
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
              name: "play",
              actor: {
                kind: "player",
                player: "opponent",
              },
              observes: {
                kind: "event-object",
                selector: "played-card",
                relationship: {
                  kind: "any",
                },
                filter: {
                  typeBox: {
                    types: ["Action"],
                  },
                },
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "until-end-of-their-next-turn",
            matching: "every",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "lose-life",
              amount: 1,
              target: {
                selector: "attack-target",
              },
            },
          },
        },
      },
    },
  }),
});

export const { red: remorselessRed } = remorseless.cards;
