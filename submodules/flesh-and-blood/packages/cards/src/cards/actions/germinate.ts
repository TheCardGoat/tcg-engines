import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/germinate.generated.ts";

export const germinate = definePitchFamily(fabPitchFamilies["germinate"], {
  keywords: [
    {
      name: "specialization",
      hero: "Florian",
    },
  ],
  abilities: () => ({
    createRunechantEmbodimentEarthTokenRepeatProcessXMore: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "choose-and-create-token",
            options: ["runechant", "embodiment-of-earth"],
            chooser: "controller",
            controller: "controller",
          },
          {
            type: "repeat",
            times: { type: "x" },
            effect: {
              type: "choose-and-create-token",
              options: ["runechant", "embodiment-of-earth"],
              chooser: "controller",
              controller: "controller",
            },
          },
          {
            type: "gain-life",
            amount: {
              type: "x",
              plus: 1,
            },
            target: {
              selector: "controller",
            },
          },
        ],
      },
    },
  }),
});
export const { blue: germinateBlue } = germinate.cards;
