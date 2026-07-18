import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("PRB02 reaction and restriction parsing", () => {
  test("parses an opponent-effect self-rest reaction as a targeted trigger", () => {
    expect(
      buildCardEffects(
        "This effect can be activated when this Character is rested by your opponent's effect. You may trash this Character and draw 2 cards.[Blocker]",
      ),
    ).toEqual({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "whenBecomesRested",
          source: "opponentEffect",
          eventFilter: { targetSelf: true },
          optional: true,
          costs: [{ cost: "trashThisCard" }],
          actions: [{ action: "draw", player: "self", amount: 2 }],
        },
      ],
    });
  });

  test("preserves the choice between a rested Leader and one non-Luffy Character", () => {
    const parsed = buildCardEffects(
      "[On Play] You may trash 1 card with a [Trigger] from your hand: Your opponent's rested Leader or up to 1 of your opponent's Characters other than [Monkey.D.Luffy] cannot attack until the end of your opponent's next End Phase.",
    );

    expect(parsed?.effects?.[0]?.actions).toEqual([
      {
        action: "choice",
        options: [
          [
            {
              action: "cannotAttack",
              target: {
                player: "opponent",
                zones: ["leader"],
                count: { amount: 1 },
                filters: [{ filter: "state", value: "rested" }],
              },
              duration: "untilEndOfOpponentNextEndPhase",
            },
          ],
          [
            {
              action: "cannotAttack",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "excludeName", value: "Monkey.D.Luffy" }],
              },
              duration: "untilEndOfOpponentNextEndPhase",
            },
          ],
        ],
      },
    ]);
  });
});
