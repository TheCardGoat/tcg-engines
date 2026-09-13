import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/deathly-wail.generated.ts";
import { bloodDebt, runeGate } from "../shared/keywords.ts";
export const deathlyWail = definePitchFamily(fabPitchFamilies["deathly-wail"], {
  keywords: [runeGate, bloodDebt],
  abilities: () => ({
    staticTriggeredCombatChainCloseCreateTokenRunechant: {
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
          type: "create-token",
          token: "runechant",
          controller: "controller",
          count: {
            type: "count",
            what: "heroes-lost-life-this-turn",
          },
        },
      },
    },
  }),
});
export const {
  red: deathlyWailRed,
  yellow: deathlyWailYellow,
  blue: deathlyWailBlue,
} = deathlyWail.cards;
