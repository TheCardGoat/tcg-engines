import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/thunk.generated.ts";

export const thunk = definePitchFamily(fabPitchFamilies["thunk"], {
  abilities: () => ({
    triggeredStaticOnClashWinEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "clash-win",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "revealed-card",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "might",
          controller: "controller",
        },
      },
    },
  }),
});

export const { red: thunkRed, yellow: thunkYellow, blue: thunkBlue } = thunk.cards;
