import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/amulet-of-lightning.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const amuletOfLightning = definePitchFamily(fabPitchFamilies["amulet-of-lightning"], {
  keywords: [goAgain],
  abilities: () => ({
    instantDestroyAmuletLightningTargetActionGainsGoAgain: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: { type: "performed-this-turn", event: "fuse-lightning", player: "controller" },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              types: ["Action"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  }),
});
export const { blue: amuletOfLightningBlue } = amuletOfLightning.cards;
