import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/descend-into-madness.generated.ts";

export const descendIntoMadness = definePitchFamily(fabPitchFamilies["descend-into-madness"], {
  abilities: () => ({
    banishRandomCardThenDraw: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "defending-hero",
              zones: ["hand"],
              count: 1,
              random: true,
            },
          },
          {
            type: "draw",
            count: 1,
            player: "attack-target",
          },
        ],
      },
    },
  }),
});

export const { blue: descendIntoMadnessBlue } = descendIntoMadness.cards;
