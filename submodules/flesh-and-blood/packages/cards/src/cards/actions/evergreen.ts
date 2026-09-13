import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/evergreen.generated.ts";
export const evergreen = definePitchFamily(fabPitchFamilies["evergreen"], {
  abilities: () => ({
    staticTriggeredPlayDelayedTriggerCombatChainCloseMove: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "played-card",
          },
          from: ["arsenal"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "combat-chain-close",
              actor: {
                kind: "none",
              },
              observes: {
                kind: "none",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-combat-chain",
            matching: "first",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "move-card",
              target: {
                selector: "self",
              },
              to: {
                zone: "deck",
                position: "bottom",
              },
            },
          },
        },
      },
    },
  }),
});
export const { red: evergreenRed, yellow: evergreenYellow, blue: evergreenBlue } = evergreen.cards;
