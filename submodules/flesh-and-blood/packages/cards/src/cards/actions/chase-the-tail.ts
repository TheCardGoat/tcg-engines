import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/chase-the-tail.generated.ts";

import { comboAbility, grantKeyword, plusPower } from "@tcg/flesh-and-blood-types";

import { combo, goAgain } from "../shared/keywords.ts";

export const chaseTheTail = definePitchFamily(fabPitchFamilies["chase-the-tail"], {
  keywords: [combo],
  abilities: () => ({
    sequence: comboAbility({
      names: ["Crouching Tiger"],
      on: "attack",
      effect: {
        type: "sequence",
        steps: [
          grantKeyword(goAgain, { target: { selector: "self" } }),
          plusPower(3, {
            duration: "this-combat-chain",
            appliesTo: { next: { name: "Crouching Tiger" } },
            target: { selector: "this-attack" },
          }),
        ],
      },
    }),
  }),
});

export const { red: chaseTheTailRed } = chaseTheTail.cards;
