import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/arcane-polarity.generated.ts";

export const arcanePolarity = definePitchFamily(fabPitchFamilies["arcane-polarity"], {
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
  abilities: (amount) => ({
    gainLife: {
      type: "conditional",
      condition: {
        type: "damage-taken",
        damageType: "arcane",
        player: "controller",
        per: "turn",
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      then: {
        type: "gain-life",
        amount,
        target: {
          selector: "controller",
        },
      },
      else: {
        type: "gain-life",
        amount: 1,
        target: {
          selector: "controller",
        },
      },
    },
  }),
});

export const {
  red: arcanePolarityRed,
  yellow: arcanePolarityYellow,
  blue: arcanePolarityBlue,
} = arcanePolarity.cards;
