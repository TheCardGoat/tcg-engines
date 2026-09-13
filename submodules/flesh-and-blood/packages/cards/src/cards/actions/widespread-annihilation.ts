import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/widespread-annihilation.generated.ts";
import { bloodDebt, runeGate } from "../shared/keywords.ts";

export const widespreadAnnihilation = definePitchFamily(
  fabPitchFamilies["widespread-annihilation"],
  {
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
              zones: ["hand"],
              filter: {
                controllerPerformedThisTurn: "lose-life",
              },
              count: 1,
            },
          },
        },
      },
    }),
  },
);

export const { blue: widespreadAnnihilationBlue } = widespreadAnnihilation.cards;
