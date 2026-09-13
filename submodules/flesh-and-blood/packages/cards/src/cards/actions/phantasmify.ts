import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/phantasmify.generated.ts";
import { goAgain, phantasm } from "../shared/keywords.ts";

export const phantasmify = definePitchFamily(fabPitchFamilies["phantasmify"], {
  parameters: {
    red: 5,
    yellow: 4,
    blue: 3,
  },
  keywords: [goAgain],
  abilities: (powerBonus) => ({
    empowerNextAttack: {
      type: "sequence",
      steps: [
        {
          type: "grant-property",
          property: {
            kind: "supertype",
            value: "Illusionist",
          },
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: nextAttackActionLatch(),
        },
        {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: powerBonus,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: nextAttackActionLatch(),
        },
        {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: phantasm,
          },
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: nextAttackActionLatch(),
        },
      ],
    },
  }),
});

export const {
  red: phantasmifyRed,
  yellow: phantasmifyYellow,
  blue: phantasmifyBlue,
} = phantasmify.cards;
