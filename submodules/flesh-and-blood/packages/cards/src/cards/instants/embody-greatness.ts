import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/embody-greatness.generated.ts";

export const embodyGreatness = definePitchFamily(fabPitchFamilies["embody-greatness"], {
  keywords: [
    {
      name: "specialization",
      hero: "Shiyana",
    },
  ],
  abilities: () => ({
    nameLivingLegendHeroBecomeHeroUntilStartNext: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "name-card",
            restriction: "living-legend-hero",
          },
          {
            type: "become",
            source: "named-hero",
            duration: "until-start-of-own-next-turn",
            except: "base-life",
          },
        ],
      },
    },
  }),
});

export const { yellow: embodyGreatnessYellow } = embodyGreatness.cards;
