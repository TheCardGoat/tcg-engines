import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/lost-in-transit.generated.ts";

export const lostInTransit = definePitchFamily(fabPitchFamilies["lost-in-transit"], {
  abilities: () => ({
    spendTreasureIslandGoldForGold: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "remove-counters",
            counter: {
              kind: "named",
              name: "gold",
            },
            count: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                name: "Treasure Island",
              },
              count: 1,
            },
          },
          then: {
            type: "conditional",
            condition: {
              type: "has-status",
              status: "hero-is-thief",
            },
            then: {
              type: "create-token",
              token: "gold",
              controller: "controller",
            },
          },
        },
      },
    },
  }),
});

export const { yellow: lostInTransitYellow } = lostInTransit.cards;
