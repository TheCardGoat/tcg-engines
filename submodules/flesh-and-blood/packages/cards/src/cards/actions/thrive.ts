import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/thrive.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const thrive = definePitchFamily(fabPitchFamilies["thrive"], {
  keywords: [goAgain],
  abilities: () => ({
    attackWouldGainPowerTurnInsteadGainsMuchPlusNumber1: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "gain",
        },
        modification: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { yellow: thriveYellow } = thrive.cards;
