import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/amethyst-amulet.generated.ts";

import { legendary, wateryGrave } from "../shared/keywords.ts";

export const amethystAmulet = definePitchFamily(fabPitchFamilies["amethyst-amulet"], {
  keywords: [legendary, wateryGrave],
  abilities: () => ({
    instantDestroyNextAttackTurnGets2: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
  }),
});
export const { blue: amethystAmuletBlue } = amethystAmulet.cards;
