import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/silverwind-shuriken.generated.ts";

export const silverwindShuriken = definePitchFamily(fabPitchFamilies["silverwind-shuriken"], {
  abilities: () => ({
    attackReactionDestroySilverwindShurikenAttackActionWithComboGainsNumber1Power: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: attackActionFilter({ hasKeyword: "combo" }),
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  }),
});

export const { blue: silverwindShurikenBlue } = silverwindShuriken.cards;
