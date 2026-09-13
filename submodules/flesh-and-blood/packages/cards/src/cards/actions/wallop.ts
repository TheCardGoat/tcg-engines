import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wallop.generated.ts";

export const wallop = definePitchFamily(fabPitchFamilies["wallop"], {
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
          token: "vigor",
          controller: "controller",
        },
      },
    },
  }),
});

export const { red: wallopRed, yellow: wallopYellow, blue: wallopBlue } = wallop.cards;
