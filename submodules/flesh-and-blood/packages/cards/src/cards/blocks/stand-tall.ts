import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/stand-tall.generated.ts";

export const standTall = definePitchFamily(fabPitchFamilies["stand-tall"], {
  abilities: () => ({
    gainPowerWhenReactionPlayed: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "attacking-hero",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                subtypes: ["Reaction"],
              },
            },
          },
        },
        state: {
          type: "has-status",
          status: "defending",
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
    gainPowerWhenReactionActivated: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "activate",
          actor: {
            kind: "player",
            player: "attacking-hero",
          },
          observes: {
            kind: "event-object",
            selector: "activated-card",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                subtypes: ["Reaction"],
              },
            },
          },
        },
        state: {
          type: "has-status",
          status: "defending",
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
  }),
});

export const { yellow: standTallYellow } = standTall.cards;
