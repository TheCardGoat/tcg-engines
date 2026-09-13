import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/flameborn-retribution.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const flamebornRetribution = definePitchFamily(fabPitchFamilies["flameborn-retribution"], {
  keywords: [goAgain],
  abilities: () => ({
    whenDefendFlamebornRetributionIfVeBeenDealtDamage: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "defender",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Flameborn Retribution",
            },
          },
        },
        state: { type: "performed-this-turn", event: "be-dealt-damage", player: "controller" },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                name: "Phoenix Flame",
              },
              count: 1,
            },
            to: {
              zone: "hand",
            },
          },
        },
      },
    },
  }),
});
export const { red: flamebornRetributionRed } = flamebornRetribution.cards;
