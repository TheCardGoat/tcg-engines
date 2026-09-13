import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/electrostatic-discharge.generated.ts";

export const electrostaticDischarge = definePitchFamily(
  fabPitchFamilies["electrostatic-discharge"],
  {
    parameters: pitchMap({
      red: { amount: 3 },
      yellow: { amount: 2 },
      blue: { amount: 1 },
    }),
    abilities: ({ amount }) => ({
      empowerNextAttack: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount,
        target: { selector: "this-attack" },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch({ cost: { op: "lte", value: 1 } }),
      },
    }),
  },
);

export const {
  red: electrostaticDischargeRed,
  yellow: electrostaticDischargeYellow,
  blue: electrostaticDischargeBlue,
} = electrostaticDischarge.cards;
