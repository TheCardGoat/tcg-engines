import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/chains-of-consecration.generated.ts";
export const chainsOfConsecration = definePitchFamily(fabPitchFamilies["chains-of-consecration"], {
  abilities: () => ({
    consecrate: {
      type: "prevention",
      preventionKind: "fixed",
      recipientScope: "any",
      amount: { type: "event-amount" },
      duration: "this-turn",
      source: {
        selector: "object",
        declared: "on-stack",
        zones: ["permanent"],
        filter: { typeBox: { subtypes: ["Ally"] } },
        count: 1,
      },
      additionalModification: {
        type: "banish",
        target: {
          selector: "binding",
          binding: "damage-source",
          filter: { typeBox: { supertypes: ["Shadow"] } },
        },
        faceDown: true,
      },
    },
  }),
});
export const { yellow: chainsOfConsecrationYellow } = chainsOfConsecration.cards;
