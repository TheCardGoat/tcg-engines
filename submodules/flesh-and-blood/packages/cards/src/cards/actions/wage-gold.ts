import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wage-gold.generated.ts";
import { universal } from "../shared/keywords.ts";

export const wageGold = definePitchFamily(fabPitchFamilies["wage-gold"], {
  keywords: [universal],
  abilities: () => ({
    triggeredStaticOnAttackEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
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
          type: "optional",
          effect: {
            type: "wager",
            stake: "gold",
            with: {
              selector: "attack-target",
            },
          },
        },
      },
      label: {
        name: "wager",
      },
    },
  }),
});

export const { red: wageGoldRed, yellow: wageGoldYellow, blue: wageGoldBlue } = wageGold.cards;
