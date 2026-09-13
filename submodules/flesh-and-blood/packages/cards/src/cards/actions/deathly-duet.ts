import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/deathly-duet.generated.ts";
export const deathlyDuet = definePitchFamily(fabPitchFamilies["deathly-duet"], {
  abilities: () => ({
    staticTriggeredPlayModifyNumericPower: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "has-status",
          status: "pitched-attack-action-card-to-play-this",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
    staticTriggeredPlayCreateTokenRunechant: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "has-status",
          status: "pitched-non-attack-action-card-to-play-this",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "runechant",
          controller: "controller",
          count: 2,
        },
      },
    },
  }),
});
export const {
  red: deathlyDuetRed,
  yellow: deathlyDuetYellow,
  blue: deathlyDuetBlue,
} = deathlyDuet.cards;
