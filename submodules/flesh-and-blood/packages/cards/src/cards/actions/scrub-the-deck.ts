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
              declared: "on-stack",
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
