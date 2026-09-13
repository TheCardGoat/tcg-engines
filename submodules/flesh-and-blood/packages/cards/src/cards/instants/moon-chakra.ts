import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/moon-chakra.generated.ts";

export const moonChakra = definePitchFamily(fabPitchFamilies["moon-chakra"], {
  parameters: pitchMap({
    red: { baseAmount: 3, transcendedAmount: 5 },
    yellow: { baseAmount: 2, transcendedAmount: 4 },
    blue: { baseAmount: 1, transcendedAmount: 3 },
  }),
  abilities: ({ baseAmount, transcendedAmount }) => ({
    preventNextDamage: {
      type: "prevention",
      preventionKind: "fixed",
      amount: {
        type: "conditional",
        condition: { type: "performed-this-turn", event: "transcend", player: "controller" },
        then: transcendedAmount,
        else: baseAmount,
      },
      shielded: { selector: "controller" },
      duration: "this-turn",
    },
  }),
});

export const {
  red: moonChakraRed,
  yellow: moonChakraYellow,
  blue: moonChakraBlue,
} = moonChakra.cards;
