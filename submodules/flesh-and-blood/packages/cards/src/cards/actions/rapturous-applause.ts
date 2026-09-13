import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rapturous-applause.generated.ts";

export const rapturousApplause = definePitchFamily(fabPitchFamilies["rapturous-applause"], {
  abilities: () => ({
    triggeredClashWinCrowdCheersTheCrowdCheers: {
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
          type: "crowd-cheers",
          target: "controller",
        },
      },
      label: {
        name: "the-crowd-cheers",
      },
    },
  }),
});
export const {
  red: rapturousApplauseRed,
  yellow: rapturousApplauseYellow,
  blue: rapturousApplauseBlue,
} = rapturousApplause.cards;
