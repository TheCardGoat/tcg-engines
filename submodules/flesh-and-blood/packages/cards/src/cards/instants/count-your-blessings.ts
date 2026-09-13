import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/count-your-blessings.generated.ts";

export const countYourBlessings = definePitchFamily(fabPitchFamilies["count-your-blessings"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (baseAmount) => ({
    gainBlessings: {
      type: "gain-life",
      amount: {
        type: "count",
        what: "cards-in-zone",
        zone: "graveyard",
        player: "controller",
        filter: {
          name: "Count Your Blessings",
        },
        plus: baseAmount,
      },
      target: {
        selector: "controller",
      },
    },
  }),
});

export const {
  red: countYourBlessingsRed,
  yellow: countYourBlessingsYellow,
  blue: countYourBlessingsBlue,
} = countYourBlessings.cards;
