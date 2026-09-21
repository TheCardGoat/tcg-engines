import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/swing-big.generated.ts";

export const swingBig = definePitchFamily(fabPitchFamilies["swing-big"], {
  abilities: () => ({
    whenCombatChainClosesDidnTHitDefendingHeroCreatesQuickenToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "combat-chain-close",
          actor: {
            kind: "none",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "has-status",
          status: "didnt-hit",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "quicken",
          creator: "token-controller",
          controller: "defending-hero",
        },
      },
    },
  }),
});

export const { red: swingBigRed } = swingBig.cards;
