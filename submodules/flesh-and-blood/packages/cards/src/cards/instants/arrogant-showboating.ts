import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/arrogant-showboating.generated.ts";

export const arrogantShowboating = definePitchFamily(fabPitchFamilies["arrogant-showboating"], {
  abilities: () => ({
    createMightTokenEachDefendingControlledByOpponentCombat: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "might",
        controller: "controller",
        count: {
          type: "count",
          what: "defending-cards-controlled-by-opponent",
        },
      },
    },
  }),
});

export const { blue: arrogantShowboatingBlue } = arrogantShowboating.cards;
