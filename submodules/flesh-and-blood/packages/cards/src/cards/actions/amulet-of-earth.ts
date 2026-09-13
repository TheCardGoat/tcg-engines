import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/amulet-of-earth.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const amuletOfEarth = definePitchFamily(fabPitchFamilies["amulet-of-earth"], {
  keywords: [goAgain],
  abilities: () => ({
    instantDestroyAmuletEarthAttackActionControlGain1: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: { type: "performed-this-turn", event: "fuse-earth", player: "controller" },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent", "combat-chain"],
              filter: attackActionFilter(),
              count: {
                type: "all",
              },
            },
            duration: "this-turn",
          },
          {
            type: "modify-numeric",
            property: "defense",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent", "combat-chain"],
              filter: attackActionFilter(),
              count: {
                type: "all",
              },
            },
            duration: "this-turn",
          },
        ],
      },
    },
  }),
});
export const { blue: amuletOfEarthBlue } = amuletOfEarth.cards;
