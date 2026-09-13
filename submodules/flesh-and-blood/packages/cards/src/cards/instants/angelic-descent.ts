import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/angelic-descent.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const angelicDescent = definePitchFamily(fabPitchFamilies["angelic-descent"], {
  parameters: pitchMap({
    red: 3,
    yellow: 2,
    blue: 1,
  }),
  abilities: (amount) => ({
    grantHeraldGoAgain: {
      type: "grant-property",
      property: { kind: "keyword", keyword: goAgain },
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: attackActionFilter({ nameContains: "Herald" }),
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
    buffNextAngelAttack: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: { selector: "this-attack" },
      duration: "this-turn",
      appliesTo: {
        next: {
          typeBox: { subtypes: ["Angel"] },
        },
      },
    },
  }),
});

export const {
  red: angelicDescentRed,
  yellow: angelicDescentYellow,
  blue: angelicDescentBlue,
} = angelicDescent.cards;
