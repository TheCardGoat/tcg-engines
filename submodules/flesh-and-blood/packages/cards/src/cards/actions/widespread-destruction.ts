import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/widespread-destruction.generated.ts";
import { bloodDebt, runeGate } from "../shared/keywords.ts";

export const widespreadDestruction = definePitchFamily(fabPitchFamilies["widespread-destruction"], {
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
          type: "for-each",
          target: {
            selector: "each-hero",
          },
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "iteration-subject",
              zones: ["arsenal"],
              filter: {
                controllerPerformedThisTurn: "lose-life",
              },
              count: 1,
            },
          },
        },
      },
    },
  }),
});

export const { yellow: widespreadDestructionYellow } = widespreadDestruction.cards;
