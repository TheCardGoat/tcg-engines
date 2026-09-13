import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/waxing-specter.generated.ts";

export const waxingSpecter = definePitchFamily(fabPitchFamilies["waxing-specter"], {
  parameters: pitchMap({
    red: 3,
    yellow: 2,
    blue: 1,
  }),
  keywords: [{ name: "ward", value: { type: "x" } }],
  abilities: () => ({
    pitchBluePowerCounter: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "pitch-zone-has",
        filter: { color: ["blue"] },
      },
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "enter-arena",
          subject: "self",
        },
        modification: {
          type: "add-counter",
          counter: {
            kind: "numeric",
            value: 1,
            property: "power",
          },
          count: 1,
          target: { selector: "self" },
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const {
  red: waxingSpecterRed,
  yellow: waxingSpecterYellow,
  blue: waxingSpecterBlue,
} = waxingSpecter.cards;
