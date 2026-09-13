import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/strike-gold.generated.ts";

export const strikeGold = definePitchFamily(fabPitchFamilies["strike-gold"], {
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
          type: "create-token",
          token: "gold",
          controller: "controller",
        },
      },
    },
  }),
});

export const {
  red: strikeGoldRed,
  yellow: strikeGoldYellow,
  blue: strikeGoldBlue,
} = strikeGold.cards;
