import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/renounce-violence.generated.ts";

export const renounceViolence = definePitchFamily(fabPitchFamilies["renounce-violence"], {
  abilities: () => ({
    destroyUp3MightTokensCreateToughnessTokenEach: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                name: "Might",
                typeBox: {
                  metatypes: ["Token"],
                },
              },
              count: { type: "up-to", amount: 3 },
            },
          },
          {
            type: "create-token",
            token: "toughness",
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

export const { blue: renounceViolenceBlue } = renounceViolence.cards;
