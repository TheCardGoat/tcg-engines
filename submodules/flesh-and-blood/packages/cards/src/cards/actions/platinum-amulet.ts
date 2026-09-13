import { legendary, wateryGrave } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/platinum-amulet.generated.ts";

export const platinumAmulet = definePitchFamily(fabPitchFamilies["platinum-amulet"], {
  keywords: [legendary, wateryGrave],
  abilities: () => ({
    instantDestroyTargetDefendingGets1DefenseEndTurn: {
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
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            defending: true,
          },
          count: 1,
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: platinumAmuletBlue } = platinumAmulet.cards;
