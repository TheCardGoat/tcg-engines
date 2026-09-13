import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pick-a-card-any-card.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const pickACardAnyCard = definePitchFamily(fabPitchFamilies["pick-a-card-any-card"], {
  parameters: { red: { times: 3 }, yellow: { times: 2 }, blue: { times: 1 } },
  keywords: [goAgain],
  abilities: ({ times }) => ({
    nameAndReveal: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["hand"],
              count: { type: "all" },
            },
          },
          { type: "name-card", suggestions: ["revealed-this-resolution"] },
        ],
      },
    },
    revealRandomCards: {
      kind: "resolution",
      effect: {
        type: "repeat",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "choose-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["hand"],
                count: 1,
              },
              random: true,
              outputBinding: "it",
            },
            { type: "reveal", target: { selector: "binding", binding: "it" } },
            {
              type: "conditional",
              condition: { type: "has-status", status: "named-card" },
              then: { type: "create-token", token: "Silver", controller: "controller" },
            },
          ],
        },
        times,
      },
    },
  }),
});

export const {
  red: pickACardAnyCardRed,
  yellow: pickACardAnyCardYellow,
  blue: pickACardAnyCardBlue,
} = pickACardAnyCard.cards;
