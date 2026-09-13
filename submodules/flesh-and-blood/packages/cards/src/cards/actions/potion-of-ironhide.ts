import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/potion-of-ironhide.generated.ts";

export const potionOfIronhide = definePitchFamily(fabPitchFamilies["potion-of-ironhide"], {
  abilities: () => ({
    instantDestroyPotionIronhideAttackActionGain1DefenseTurn: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["stack", "combat-chain", "hand", "arsenal", "permanent"],
          filter: attackActionFilter(),
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: potionOfIronhideBlue } = potionOfIronhide.cards;
