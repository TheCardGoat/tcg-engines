import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, modalAbility, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/captain-s-call.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const captainSCall = definePitchFamily(fabPitchFamilies["captain-s-call"], {
  parameters: pitchMap({
    red: { costLimit: 2, powerBonus: 2 },
    yellow: { costLimit: 1, powerBonus: 2 },
    blue: { costLimit: 0, powerBonus: 2 },
  }),
  abilities: ({ costLimit, powerBonus }) => ({
    chooseMode: modalAbility({
      kind: "modal",
      modal: { choose: 1 },
      modes: {
        empower: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: powerBonus,
          target: { selector: "this-attack" },
          duration: "this-turn",
          appliesTo: { next: attackActionFilter({ cost: { op: "lte", value: costLimit } }) },
        },
        grantGoAgain: {
          type: "grant-property",
          property: { kind: "keyword", keyword: goAgain },
          target: { selector: "this-attack" },
          duration: "this-turn",
          appliesTo: { next: attackActionFilter({ cost: { op: "lte", value: costLimit } }) },
        },
        selfGoAgain: {
          type: "grant-property",
          property: { kind: "keyword", keyword: goAgain },
          target: { selector: "self" },
          duration: "this-turn",
        },
      },
    }),
  }),
});

export const {
  red: captainSCallRed,
  yellow: captainSCallYellow,
  blue: captainSCallBlue,
} = captainSCall.cards;
