import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sharp-n-shine.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const sharpNShine = definePitchFamily(fabPitchFamilies["sharp-n-shine"], {
  parameters: pitchMap({ red: 1, yellow: 2, blue: 3 }),
  keywords: [{ name: "sharpen" }, goAgain],
  abilities: (threshold) => ({
    sequence: {
      type: "sequence",
      steps: [
        {
          type: "sharpen",
          target: {
            selector: "object",
            declared: "on-stack",
            player: "controller",
            zones: ["weapon", "permanent"],
            filter: { typeBox: { subtypes: ["Sword"] } },
            count: 1,
          },
          outputBinding: "it",
        },
        {
          type: "conditional",
          condition: {
            type: "has-counter",
            counter: { kind: "numeric", value: 1, property: "power" },
            target: { selector: "binding", binding: "it" },
            comparison: { op: "gte", value: threshold },
          },
          then: { type: "create-token", token: "blade-dance", controller: "controller" },
        },
      ],
    },
  }),
});

export const {
  red: sharpNShineRed,
  yellow: sharpNShineYellow,
  blue: sharpNShineBlue,
} = sharpNShine.cards;
