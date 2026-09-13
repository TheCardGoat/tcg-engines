import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rough-up.generated.ts";

export const roughUp = definePitchFamily(fabPitchFamilies["rough-up"], {
  abilities: () => ({
    triggeredAttackPitchZoneHasModifyNumericPowerThisTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: {
          type: "pitch-zone-has",
          filter: {
            power: {
              op: "gte",
              value: 6,
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const { red: roughUpRed, yellow: roughUpYellow, blue: roughUpBlue } = roughUp.cards;
