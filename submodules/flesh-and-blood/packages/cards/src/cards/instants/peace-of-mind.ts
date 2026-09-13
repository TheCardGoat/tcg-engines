import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/peace-of-mind.generated.ts";

export const peaceOfMind = definePitchFamily(fabPitchFamilies["peace-of-mind"], {
  parameters: pitchMap({
    red: { amount: 4 },
    yellow: { amount: 3 },
    blue: { amount: 2 },
  }),
  abilities: ({ amount }) => ({
    preventPhysical: {
      type: "prevention",
      preventionKind: "fixed",
      amount,
      damageType: "physical",
      shielded: { selector: "controller" },
      duration: "this-turn",
    },
    createPonder: {
      type: "create-token",
      token: "ponder",
      controller: "controller",
    },
  }),
});

export const {
  red: peaceOfMindRed,
  yellow: peaceOfMindYellow,
  blue: peaceOfMindBlue,
} = peaceOfMind.cards;
