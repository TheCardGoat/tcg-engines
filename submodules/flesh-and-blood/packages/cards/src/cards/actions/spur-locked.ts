import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spur-locked.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const spurLocked = definePitchFamily(fabPitchFamilies["spur-locked"], {
  keywords: [goAgain],
  abilities: () => ({
    eachHeroSecretlyChoosesNumberBetweenNumber1Number6ThoseNumbersRevealedHero: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "choose-number",
            min: 1,
            max: 6,
            chooser: "each",
            secret: true,
          },
          {
            type: "for-each",
            target: {
              selector: "each-hero",
            },
            effect: {
              type: "conditional",
              condition: {
                // "The hero that chose the highest number" pays — every
                // tied-highest chooser qualifies; ties pay both.
                type: "compare-amount",
                amount: {
                  type: "reference",
                  binding: "chose-highest-number",
                },
                comparison: {
                  op: "eq",
                  value: 1,
                },
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "lose-life",
                    amount: {
                      type: "reference",
                      binding: "chosen-number",
                    },
                    target: {
                      selector: "iteration-subject",
                    },
                  },
                  {
                    type: "search",
                    player: "iteration-subject",
                    zones: ["deck"],
                    filter: {
                      cost: {
                        op: "lte",
                        value: {
                          type: "reference",
                          binding: "chosen-number",
                        },
                      },
                    },
                    mayFail: true,
                    to: {
                      zone: "hand",
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  }),
});

export const { blue: spurLockedBlue } = spurLocked.cards;
