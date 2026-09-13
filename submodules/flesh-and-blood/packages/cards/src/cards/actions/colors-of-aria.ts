import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/colors-of-aria.generated.ts";

/** Model notes (hand-authored): Earth/Ice/Lightning while face-up in any zone, not only while in arena. */
export const colorsOfAria = definePitchFamily(fabPitchFamilies["colors-of-aria"], {
  abilities: () => ({
    whileIsFaceUpAnyZoneSEarthIce: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "face-up-in-any-zone",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-property",
            property: {
              kind: "supertype",
              value: "Earth",
            },
            target: {
              selector: "self",
            },
            duration: "while-condition",
          },
          {
            type: "grant-property",
            property: {
              kind: "supertype",
              value: "Ice",
            },
            target: {
              selector: "self",
            },
            duration: "while-condition",
          },
          {
            type: "grant-property",
            property: {
              kind: "supertype",
              value: "Lightning",
            },
            target: {
              selector: "self",
            },
            duration: "while-condition",
          },
        ],
      },
    },
  }),
});
export const { red: colorsOfAriaRed } = colorsOfAria.cards;
