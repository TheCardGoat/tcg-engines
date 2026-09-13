import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/amulet-of-havencall.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const amuletOfHavencall = definePitchFamily(fabPitchFamilies["amulet-of-havencall"], {
  keywords: [goAgain],
  abilities: () => ({
    defenseReactionDestroyAmuletHavencallSearchDeckNamedRally: {
      kind: "activated",
      abilityType: "defense-reaction",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "zone-count",
        zone: "hand",
        player: "controller",
        comparison: {
          op: "eq",
          value: 0,
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "add-defending",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              filter: {
                name: "Rally The Rearguard",
              },
              count: 1,
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
  }),
});
export const { blue: amuletOfHavencallBlue } = amuletOfHavencall.cards;
