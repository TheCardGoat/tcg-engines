import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shoot-your-mouth-off.generated.ts";

export const shootYourMouthOff = definePitchFamily(fabPitchFamilies["shoot-your-mouth-off"], {
  abilities: () => ({
    triggeredStaticOnCombatChainCloseEffect: {
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
          token: "confidence",
          creator: "token-controller",
          controller: "defending-hero",
        },
      },
    },
  }),
});

export const {
  red: shootYourMouthOffRed,
  yellow: shootYourMouthOffYellow,
  blue: shootYourMouthOffBlue,
} = shootYourMouthOff.cards;
