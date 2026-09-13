import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/deathly-delight.generated.ts";
import { bloodDebt, runeGate } from "../shared/keywords.ts";
export const deathlyDelight = definePitchFamily(fabPitchFamilies["deathly-delight"], {
  keywords: [runeGate, bloodDebt],
  abilities: () => ({
    staticTriggeredCombatChainCloseGainLife: {
      kind: "static",
      staticKind: "triggered",
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
      resolution: {
        kind: "effect",
        effect: {
          type: "gain-life",
          amount: {
            type: "count",
            what: "heroes-lost-life-this-turn",
          },
          target: {
            selector: "controller",
          },
        },
      },
    },
  }),
});
export const {
  red: deathlyDelightRed,
  yellow: deathlyDelightYellow,
  blue: deathlyDelightBlue,
} = deathlyDelight.cards;
