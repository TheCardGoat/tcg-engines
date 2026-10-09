import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scrub-the-deck.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const scrubTheDeck = definePitchFamily(fabPitchFamilies["scrub-the-deck"], {
  keywords: [goAgain],
  abilities: () => ({
    destroyTopHeroSDeckSYellowCreateGoldToken: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              // Printed "target hero's deck": only the hero is targeted
              // (CR 1.8.5); the destroyed card is the top of that hero's
              // deck, determined at resolution.
              playerTarget: { selector: "any-hero" },
              playerTargetBinding: "scrub-target-hero",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                color: ["yellow"],
              },
            },
            then: {
              type: "create-token",
              token: "gold",
              controller: "controller",
            },
          },
        ],
      },
    },
  }),
});

export const { blue: scrubTheDeckBlue } = scrubTheDeck.cards;
