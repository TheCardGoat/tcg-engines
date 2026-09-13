import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lost-in-thought.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const lostInThought = definePitchFamily(fabPitchFamilies["lost-in-thought"], {
  keywords: [goAgain],
  abilities: () => ({
    lookTargetHerosHandChooseAttackActionRevealPutBottomDeckCreatePonderToken: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              playerTarget: { selector: "any-hero" },
              playerTargetBinding: "looked-hero",
              zones: ["hand"],
              count: {
                type: "all",
              },
            },
          },
          {
            type: "if-you-do",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "choose-card",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    playerTargetBinding: "looked-hero",
                    zones: ["hand"],
                    filter: attackActionFilter(),
                    count: 1,
                  },
                  outputBinding: "it",
                },
                {
                  type: "reveal",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                },
              ],
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "move-card",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                  to: {
                    zone: "deck",
                    position: "bottom",
                  },
                },
                {
                  type: "create-token",
                  token: "ponder",
                  controller: "controller",
                },
              ],
            },
          },
        ],
      },
    },
  }),
});

export const { red: lostInThoughtRed } = lostInThought.cards;
