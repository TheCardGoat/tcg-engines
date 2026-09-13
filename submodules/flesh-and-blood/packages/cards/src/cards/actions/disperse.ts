import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/disperse.generated.ts";

export const disperse = definePitchFamily(fabPitchFamilies["disperse"], {
  abilities: () => ({
    whenAttacksIfVeBeenCheeredTurnCreateToughness: {
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
        state: { type: "performed-this-turn", event: "cheered", player: "controller" },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "toughness",
          controller: "controller",
        },
      },
    },
    whenDefendsIfHas6MoreAttackingHeroPuts: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
        state: {
          type: "binding-matches",
          binding: "it",
          filter: {
            defense: {
              op: "gte",
              value: 6,
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attacking-hero",
            zones: ["arsenal"],
            count: 1,
          },
          to: {
            zone: "deck",
            position: "bottom",
          },
        },
      },
    },
  }),
});
export const { blue: disperseBlue } = disperse.cards;
