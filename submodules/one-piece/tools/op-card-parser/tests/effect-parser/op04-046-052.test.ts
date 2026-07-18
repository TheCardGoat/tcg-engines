import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-046/050/051/052 Character transformations", () => {
  test("parses Queen's total-up-to-two alternative-name search", () => {
    expect(
      buildCardEffects(
        "[On Play] If your Leader has the [Animal Kingdom Pirates] type, look at 7 cards from the top of your deck; reveal a total of up to 2 [Plague Rounds] or [Ice Oni] cards and add them to your hand. Then, place the rest at the bottom of your deck in any order.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [
            {
              condition: "leaderTrait",
              trait: "Animal Kingdom Pirates",
              match: "includes",
            },
          ],
          actions: [
            {
              action: "search",
              lookCount: 7,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 2, upTo: true },
              revealFilters: [
                {
                  filter: "anyOf",
                  filters: [
                    { filter: "name", value: "Plague Rounds" },
                    { filter: "name", value: "Ice Oni" },
                  ],
                },
              ],
              revealDestination: "hand",
              remainderPosition: "bottom",
            },
          ],
        },
      ],
    });
  });

  test("parses Hanger's hand-trash and self-rest costs", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] You may trash 1 card from your hand and rest this Character: Draw 1 card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "trashFromHand", amount: 1 }, { cost: "restThisCard" }],
          actions: [{ action: "draw", player: "self", amount: 1 }],
          optional: true,
        },
      ],
    });
  });

  test("parses Who's.Who's inclusive trait search and self-name exclusion", () => {
    expect(
      buildCardEffects(
        "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Animal Kingdom Pirates] type card other than [Who's.Who] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "search",
              lookCount: 5,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 1, upTo: true },
              revealFilters: [
                { filter: "excludeName", value: "Who's.Who" },
                { filter: "trait", value: "Animal Kingdom Pirates", match: "includes" },
              ],
              revealDestination: "hand",
              remainderPosition: "bottom",
            },
          ],
        },
      ],
    });
  });

  test("parses Black Maria's Main costs and physical-card Trigger play", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] (2) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Character: Draw 1 card. [Trigger] Play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "restDon", amount: 2 }, { cost: "restThisCard" }],
          actions: [{ action: "draw", player: "self", amount: 1 }],
          optional: true,
        },
        {
          trigger: "trigger",
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });
});
