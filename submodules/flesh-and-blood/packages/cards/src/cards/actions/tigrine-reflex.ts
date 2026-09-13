import { comboStatic } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tigrine-reflex.generated.ts";
import { combo, goAgain } from "../shared/keywords.ts";

export const tigrineReflex = definePitchFamily(fabPitchFamilies["tigrine-reflex"], {
  keywords: [goAgain, combo],
  abilities: () => ({
    comboStatic: comboStatic({
      names: ["Crouching Tiger"],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
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
        ],
      },
    }),
    attackReactionDiscardNinjaAttackGetsNumber1PowerCreateCrouchingTigerIn: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "discard-self",
      },
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
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  supertypes: ["Ninja"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
          {
            type: "create-token",
            token: "crouching-tiger",
            controller: "controller",
            to: {
              zone: "hand",
            },
          },
        ],
      },
    },
  }),
});

export const { red: tigrineReflexRed } = tigrineReflex.cards;
