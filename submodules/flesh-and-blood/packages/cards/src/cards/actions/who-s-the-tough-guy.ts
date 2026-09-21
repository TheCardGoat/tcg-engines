import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/who-s-the-tough-guy.generated.ts";

export const whoSTheToughGuy = definePitchFamily(fabPitchFamilies["who-s-the-tough-guy"], {
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
          token: "toughness",
          creator: "token-controller",
          controller: "defending-hero",
        },
      },
    },
  }),
});
export const {
  red: whoSTheToughGuyRed,
  yellow: whoSTheToughGuyYellow,
  blue: whoSTheToughGuyBlue,
} = whoSTheToughGuy.cards;
