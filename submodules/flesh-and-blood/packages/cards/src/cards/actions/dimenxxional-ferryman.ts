import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/dimenxxional-ferryman.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const dimenxxionalFerryman = definePitchFamily(fabPitchFamilies["dimenxxional-ferryman"], {
  keywords: [goAgain],
  abilities: () => ({
    return: {
      type: "sequence",
      steps: [
        {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["banished"],
            filter: { typeBox: { types: ["Action"] }, hasKeyword: "blood-debt" },
            count: 1,
          },
          to: { zone: "deck", position: "bottom" },
        },
        {
          type: "move-card",
          target: { selector: "self" },
          to: { zone: "deck", position: "bottom" },
        },
      ],
    },
  }),
});
export const { blue: dimenxxionalFerrymanBlue } = dimenxxionalFerryman.cards;
