import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/proclaim-vengeance.generated.ts";

export const proclaimVengeance = definePitchFamily(fabPitchFamilies["proclaim-vengeance"], {
  abilities: () => ({
    markTargetOpposingHeroIfHeroIsArakniGain: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "mark",
            target: {
              selector: "opponent",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "has-status",
              status: "that-hero-is-arakni",
            },
            then: {
              type: "gain-resources",
              amount: 1,
            },
          },
        ],
      },
      label: {
        name: "mark",
      },
    },
  }),
});

export const { red: proclaimVengeanceRed } = proclaimVengeance.cards;
