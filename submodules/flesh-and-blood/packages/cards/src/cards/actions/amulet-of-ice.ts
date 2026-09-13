import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/amulet-of-ice.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const amuletOfIce = definePitchFamily(fabPitchFamilies["amulet-of-ice"], {
  keywords: [goAgain],
  abilities: () => ({
    instantDestroyAmuletIceTargetHeroDiscardsUnlessThey: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: { type: "performed-this-turn", event: "fuse-ice", player: "controller" },
      effect: {
        type: "unless",
        effect: {
          type: "discard",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["hand"],
            count: 1,
          },
        },
        escape: {
          type: "pay",
          cost: {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          payer: "opponent",
        },
      },
    },
  }),
});
export const { blue: amuletOfIceBlue } = amuletOfIce.cards;
