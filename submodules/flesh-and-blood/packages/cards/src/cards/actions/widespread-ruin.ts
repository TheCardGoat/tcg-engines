import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/widespread-ruin.generated.ts";
import { bloodDebt, runeGate } from "../shared/keywords.ts";

export const widespreadRuin = definePitchFamily(fabPitchFamilies["widespread-ruin"], {
  keywords: [runeGate, bloodDebt],
  abilities: () => ({
    whenCombatChainClosesEachHeroWhoHasLostLifeTurnBanishes: {
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
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "each",
            zones: ["deck"],
            position: "top",
            filter: {
              controllerPerformedThisTurn: "lose-life",
            },
            count: 1,
          },
        },
      },
    },
  }),
});

export const { red: widespreadRuinRed } = widespreadRuin.cards;
