import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/soulbead-strike.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const soulbeadStrike = definePitchFamily(fabPitchFamilies["soulbead-strike"], {
  abilities: () => ({
    triggeredStaticOnHitEffect: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const {
  red: soulbeadStrikeRed,
  yellow: soulbeadStrikeYellow,
  blue: soulbeadStrikeBlue,
} = soulbeadStrike.cards;
