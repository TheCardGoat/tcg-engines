import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-053 through OP04-062 parser regressions", () => {
  test("maps Page One to its controller's Event activation", () => {
    expect(
      buildCardEffects(
        "[DON!! x1] [Once Per Turn] When you activate an Event, draw 1 card. Then, place 1 card from your hand at the bottom of your deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenYouActivateEvent",
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            { action: "draw", player: "self", amount: 1 },
            {
              action: "returnToDeck",
              target: { player: "self", zones: ["hand"], count: { amount: 1 } },
              position: "bottom",
            },
          ],
          oncePerTurn: true,
        },
      ],
    });
  });

  test.each([
    ["Rokki", "NULL"],
    ["Bananagator", "NULL"],
  ])("keeps vanilla %s effectless", (_name, text) => {
    expect(buildCardEffects(text)).toBeUndefined();
  });

  test("keeps Iceburg's Leader gate after its optional DON!! cost", () => {
    expect(
      buildCardEffects(
        "[On Your Opponent's Attack] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the [Water Seven] type, this Character gains [Blocker] during this turn. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onOpponentAttack",
          costs: [{ cost: "returnDon", amount: 1 }],
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              keyword: "blocker",
              duration: "thisTurn",
              condition: {
                condition: "leaderTrait",
                trait: "Water Seven",
                match: "includes",
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("keeps both Crocodile DON!! costs optional and the On Play gate post-cost", () => {
    expect(
      buildCardEffects(
        "[On Play] DON!! -2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader's type includes \"Baroque Works\", add up to 1 card from the top of your deck to the top of your Life cards. [On Your Opponent's Attack] [Once Per Turn] DON!! -1: Draw 1 card and trash 1 card from your hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "returnDon", amount: 2 }],
          actions: [
            {
              action: "addToLife",
              target: {
                player: "self",
                zones: ["deck"],
                count: { amount: 1, upTo: true },
              },
              position: "top",
              condition: {
                condition: "leaderTrait",
                trait: "Baroque Works",
                match: "includes",
              },
            },
          ],
          optional: true,
        },
        {
          trigger: "onOpponentAttack",
          costs: [{ cost: "returnDon", amount: 1 }],
          actions: [
            { action: "draw", player: "self", amount: 1 },
            { action: "trashFromHand", player: "self", amount: 1 },
          ],
          optional: true,
          oncePerTurn: true,
        },
      ],
    });
  });

  test("keeps Tom's Water Seven gate after trashing itself", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] You may trash this Character: If your Leader has the [Water Seven] type, add up to 1 DON!! card from your DON!! deck and rest it.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "trashThisCard" }],
          actions: [
            {
              action: "addDon",
              count: { amount: 1, upTo: true },
              state: "rested",
              condition: {
                condition: "leaderTrait",
                trait: "Water Seven",
                match: "includes",
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });
});
