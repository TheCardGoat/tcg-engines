import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/take-that.generated.ts";

export const takeThat = definePitchFamily(fabPitchFamilies["take-that"], {
  abilities: () => ({
    createMightWhenCombatChainClosesWithoutHit: {
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
          token: "might",
          controller: "defending-hero",
        },
      },
    },
  }),
});
export const { red: takeThatRed, yellow: takeThatYellow, blue: takeThatBlue } = takeThat.cards;
