import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/weave-lightning.generated.ts";

export const weaveLightning = definePitchFamily(fabPitchFamilies["weave-lightning"], {
  keywords: [goAgain],

  abilities: () => ({
    empowerNextLightningOrElementalAttack: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: nextAttackActionLatch({
              or: [
                {
                  typeBox: {
                    supertypes: ["Lightning"],
                  },
                },
                {
                  typeBox: {
                    supertypes: ["Elemental"],
                  },
                },
              ],
            }),
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                hasStatus: "fused",
              },
            },
            then: {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          },
        ],
      },
    },
  }),
});
export const {
  red: weaveLightningRed,
  yellow: weaveLightningYellow,
  blue: weaveLightningBlue,
} = weaveLightning.cards;
