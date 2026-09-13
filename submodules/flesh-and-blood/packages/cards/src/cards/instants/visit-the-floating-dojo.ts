import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/visit-the-floating-dojo.generated.ts";

export const visitTheFloatingDojo = definePitchFamily(fabPitchFamilies["visit-the-floating-dojo"], {
  keywords: [
    {
      name: "specialization",
      hero: "Katsu",
    },
  ],
  abilities: () => ({
    putSurgingStrikeComboFromGraveyardTopBottomDeck: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                name: "Surging Strike",
              },
              count: 1,
            },
            to: {
              zone: "deck",
              position: "top-or-bottom",
            },
          },
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                hasKeyword: "combo",
              },
              count: 1,
            },
            to: {
              zone: "deck",
              position: "top-or-bottom",
            },
          },
        ],
      },
    },
  }),
});

export const { blue: visitTheFloatingDojoBlue } = visitTheFloatingDojo.cards;
