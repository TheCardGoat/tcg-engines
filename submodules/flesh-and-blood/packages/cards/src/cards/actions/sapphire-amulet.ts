import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sapphire-amulet.generated.ts";
import { legendary, wateryGrave } from "../shared/keywords.ts";

export const sapphireAmulet = definePitchFamily(fabPitchFamilies["sapphire-amulet"], {
  keywords: [legendary, wateryGrave],
  abilities: () => ({
    actionDestroyGetNumber1IntellectTurn: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "modify-numeric",
        property: "intellect",
        op: "add",
        amount: 1,
        target: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: sapphireAmuletBlue } = sapphireAmulet.cards;
