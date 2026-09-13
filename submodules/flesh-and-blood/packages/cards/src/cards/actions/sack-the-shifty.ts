import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sack-the-shifty.generated.ts";

export const sackTheShifty = definePitchFamily(fabPitchFamilies["sack-the-shifty"], {
  abilities: () => ({
    contractBanishGoAgainCards: {
      kind: "resolution",
      effect: {
        type: "contract-task",
        task: "banish opponents' cards with base go again",
        completeOn: "banish",
        filter: {
          hasKeyword: "go-again",
        },
      },
      label: {
        name: "contract",
      },
    },
    gainSilverWhenContractCompleted: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "complete-contract",
          actor: {
            kind: "any",
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
          token: "silver",
          controller: "controller",
        },
      },
      label: {
        name: "contract",
      },
    },
    banishTopCardOnHit: {
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
          target: {
            kind: "hero",
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
            player: "opponent",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          outputBinding: "banished",
        },
      },
    },
  }),
});
export const {
  red: sackTheShiftyRed,
  yellow: sackTheShiftyYellow,
  blue: sackTheShiftyBlue,
} = sackTheShifty.cards;
