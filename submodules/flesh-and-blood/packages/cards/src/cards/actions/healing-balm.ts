import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/healing-balm.generated.ts";

export const healingBalm = definePitchFamily(fabPitchFamilies["healing-balm"], {
  parameters: {
    red: { amount: 3 },
    yellow: { amount: 2 },
    blue: { amount: 1 },
  },
  abilities: ({ amount }) => ({
    gainLife: { type: "gain-life", amount, target: { selector: "controller" } },
  }),
});

export const {
  red: healingBalmRed,
  yellow: healingBalmYellow,
  blue: healingBalmBlue,
} = healingBalm.cards;
