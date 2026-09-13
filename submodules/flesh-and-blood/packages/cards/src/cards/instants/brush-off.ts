import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/brush-off.generated.ts";

export const brushOff = definePitchFamily(fabPitchFamilies["brush-off"], {
  parameters: pitchMap({
    red: { threshold: 3, incomingDamage: { op: "lte", value: 3 } },
    yellow: { threshold: 2, incomingDamage: { op: "lte", value: 2 } },
    blue: { threshold: 1, incomingDamage: { op: "eq", value: 1 } },
  }),
  abilities: ({ threshold, incomingDamage }) => ({
    preventDamage: {
      type: "prevention",
      preventionKind: "fixed",
      amount: threshold,
      incomingDamage,
      shielded: { selector: "controller" },
      duration: "this-turn",
    },
  }),
});

export const { red: brushOffRed, yellow: brushOffYellow, blue: brushOffBlue } = brushOff.cards;
