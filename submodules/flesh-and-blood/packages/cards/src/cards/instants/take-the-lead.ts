import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/take-the-lead.generated.ts";

export const takeTheLead = definePitchFamily(fabPitchFamilies["take-the-lead"], {
  abilities: () => ({
    prevention: {
      type: "prevention",
      preventionKind: "fixed",
      amount: 2,
      shielded: { selector: "controller" },
      duration: "this-turn",
      additionalModification: {
        type: "create-token",
        token: "blade-dance",
        controller: "controller",
      },
    },
  }),
});
export const { red: takeTheLeadRed } = takeTheLead.cards;
