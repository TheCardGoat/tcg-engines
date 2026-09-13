import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/shimmer-of-the-blade.generated.ts";

export const shimmerOfTheBlade = definePitchFamily(fabPitchFamilies["shimmer-of-the-blade"], {
  abilities: () => ({
    weaponBoost: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: 3,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: { typeBox: { types: ["Weapon"] } },
        count: 1,
      },
      duration: "this-turn",
    },
    discardBladeDance: {
      kind: "activated",
      abilityType: "instant",
      cost: { class: "effect", type: "discard-self" },
      effect: { type: "create-token", token: "blade-dance", controller: "controller" },
    },
  }),
});

export const { red: shimmerOfTheBladeRed } = shimmerOfTheBlade.cards;
