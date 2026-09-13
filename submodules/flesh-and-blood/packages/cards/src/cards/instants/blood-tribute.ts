import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/blood-tribute.generated.ts";
import { opt } from "../shared/keywords.ts";

export const bloodTribute = definePitchFamily(fabPitchFamilies["blood-tribute"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: pitchMap({ red: [opt(3)], yellow: [opt(2)], blue: [opt(1)] }),
  abilities: (count) => ({
    optThenBanish: {
      type: "sequence",
      steps: [
        {
          type: "opt",
          count,
        },
        {
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          outputBinding: "it",
        },
      ],
    },
  }),
});

export const {
  red: bloodTributeRed,
  yellow: bloodTributeYellow,
  blue: bloodTributeBlue,
} = bloodTribute.cards;
