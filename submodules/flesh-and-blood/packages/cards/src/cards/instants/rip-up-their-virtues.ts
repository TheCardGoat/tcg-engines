import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/rip-up-their-virtues.generated.ts";

export const ripUpTheirVirtues = definePitchFamily(fabPitchFamilies["rip-up-their-virtues"], {
  abilities: () => ({
    destroyUp3ToughnessTokensCreateMightTokenEach: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "any",
              zones: ["permanent"],
              filter: {
                name: "Toughness",
                typeBox: {
                  metatypes: ["Token"],
                },
              },
              count: { type: "up-to", amount: 3 },
            },
          },
          {
            type: "create-token",
            token: "might",
            controller: "controller",
            count: {
              type: "count",
              what: "destroyed-this-way",
            },
          },
        ],
      },
    },
  }),
});

export const { blue: ripUpTheirVirtuesBlue } = ripUpTheirVirtues.cards;
