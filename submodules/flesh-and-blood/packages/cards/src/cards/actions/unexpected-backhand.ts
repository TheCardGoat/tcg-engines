import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/unexpected-backhand.generated.ts";

export const unexpectedBackhand = definePitchFamily(fabPitchFamilies["unexpected-backhand"], {
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
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "generic",
          amount: 1,
          target: {
            selector: "opponent",
          },
        },
      },
    },
  }),
});

export const {
  red: unexpectedBackhandRed,
  yellow: unexpectedBackhandYellow,
  blue: unexpectedBackhandBlue,
} = unexpectedBackhand.cards;
