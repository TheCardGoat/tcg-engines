import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/eirina-s-prayer.generated.ts";

export const eirinasPrayer = definePitchFamily(fabPitchFamilies["eirina-s-prayer"], {
  parameters: pitchMap({ red: 6, yellow: 5, blue: 4 }),
  abilities: (amount) => ({
    revealAndPrevent: {
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
          preventionKind: "shielding",
          amount: {
            type: "difference",
            operands: [
              amount,
              {
                type: "reference",
                binding: "it",
                property: "pitch",
                missing: "zero",
              },
            ],
          },
          damageType: "arcane",
          shielded: { selector: "controller" },
          duration: "this-turn",
        },
      ],
    },
  }),
});

export const {
  red: eirinasPrayerRed,
  yellow: eirinasPrayerYellow,
  blue: eirinasPrayerBlue,
} = eirinasPrayer.cards;

export { eirinasPrayerBlue as eirinaSPrayerBlue };
export { eirinasPrayerRed as eirinaSPrayerRed };
export { eirinasPrayerYellow as eirinaSPrayerYellow };
