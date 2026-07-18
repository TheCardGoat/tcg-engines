import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP06-006 through OP06-012 parser regressions", () => {
  test("preserves Saga's delayed end-of-turn FILM trash", () => {
    expect(
      buildCardEffects(
        "[DON!! x1][When Attacking] This Character gains +1000 power until the start of your next turn. Then, trash 1 of your [FILM] type Characters at the end of this turn.",
      ),
    ).toMatchObject({
      effects: [
        {
          actions: [
            { action: "modifyPower", duration: "untilStartOfNextTurn" },
            {
              action: "delayed",
              timing: "endOfThisTurn",
              actions: [
                {
                  action: "trashFromField",
                  target: {
                    filters: [{ filter: "trait", value: "FILM", match: "includes" }],
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test("shares Shuraiya's once-per-turn identity across both triggers", () => {
    const generated = buildCardEffects(
      "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[When Attacking] / [On Block] [Once Per Turn] This Character's base power becomes the same as your opponent's Leader until the start of your next turn.",
    );

    expect(generated?.effects).toEqual([
      expect.objectContaining({
        trigger: "whenAttacking",
        oncePerTurn: true,
        oncePerTurnKey:
          "shared:whenAttacking|onBlock:this character's base power becomes the same as your opponent's leader until the start of your next turn.",
      }),
      expect.objectContaining({
        trigger: "onBlock",
        oncePerTurn: true,
        oncePerTurnKey:
          "shared:whenAttacking|onBlock:this character's base power becomes the same as your opponent's leader until the start of your next turn.",
      }),
    ]);
    expect(generated?.effects?.[0]?.actions?.[0]).toMatchObject({
      action: "setBasePowerFrom",
      source: { player: "opponent", zones: ["leader"] },
      duration: "untilStartOfNextTurn",
    });
  });

  test("treats bracketed Uta as a name restriction on Tot Musica's rest cost", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] [Once Per Turn] You may rest 1 of your [Uta] cards: This Character gains +5000 power during this turn.",
      ),
    ).toMatchObject({
      effects: [
        {
          costs: [{ cost: "restCards", amount: 1, filters: [{ filter: "name", value: "Uta" }] }],
        },
      ],
    });
  });

  test("keeps Bear.King's Leader-or-Character power condition", () => {
    expect(
      buildCardEffects(
        "If your opponent has a Leader or Character with a base power of 6000 or more, this Character cannot be K.O.'d in battle.",
      ),
    ).toMatchObject({
      permanentEffects: [
        {
          conditions: [
            {
              condition: "compound",
              operator: "or",
              conditions: [
                { condition: "hasCard", player: "opponent", zone: "leader" },
                { condition: "hasCard", player: "opponent", zone: "character" },
              ],
            },
          ],
        },
      ],
    });
  });
});
