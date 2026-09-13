import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/throw-caution-to-the-wind.generated.ts";

export const throwCautionToTheWind = definePitchFamily(
  fabPitchFamilies["throw-caution-to-the-wind"],
  {
    abilities: () => ({
      revealTopDeckNextTimeWouldBeDealtDamage: {
        kind: "resolution",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "reveal",
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
            {
              type: "prevention",
              preventionKind: "fixed",
              amount: {
                type: "reference",
                binding: "it",
                property: "pitch",
                missing: "zero",
              },
              shielded: {
                selector: "controller",
              },
              duration: "this-turn",
            },
          ],
        },
      },
    }),
  },
);

export const { blue: throwCautionToTheWindBlue } = throwCautionToTheWind.cards;
