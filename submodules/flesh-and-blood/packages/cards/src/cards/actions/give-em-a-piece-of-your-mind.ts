import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/give-em-a-piece-of-your-mind.generated.ts";
export const giveEmAPieceOfYourMind = definePitchFamily(
  fabPitchFamilies["give-em-a-piece-of-your-mind"],
  {
    abilities: () => ({
      staticTriggeredCombatChainCloseCreateTokenVigor: {
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
            token: "vigor",
            controller: "defending-hero",
          },
        },
      },
    }),
  },
);
export const {
  red: giveEmAPieceOfYourMindRed,
  yellow: giveEmAPieceOfYourMindYellow,
  blue: giveEmAPieceOfYourMindBlue,
} = giveEmAPieceOfYourMind.cards;
