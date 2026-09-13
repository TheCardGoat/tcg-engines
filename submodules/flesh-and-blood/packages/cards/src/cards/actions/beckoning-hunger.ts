import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/beckoning-hunger.generated.ts";

export const beckoningHunger = definePitchFamily(fabPitchFamilies["beckoning-hunger"], {
  keywords: [bloodDebt],

  abilities: () => ({
    onAttackBanish: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
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
            player: "controller",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          outputBinding: "it",
        },
      },
    },
    onHitCreateTokenBlasmophetTheInsatiableHunger: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "blasmophet-the-insatiable-hunger",
          controller: "controller",
        },
      },
    },
  }),
});
export const {
  red: beckoningHungerRed,
  yellow: beckoningHungerYellow,
  blue: beckoningHungerBlue,
} = beckoningHunger.cards;
