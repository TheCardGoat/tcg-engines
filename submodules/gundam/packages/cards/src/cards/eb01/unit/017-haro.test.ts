import { describe, expect, it } from "vite-plus/test";
import { createMockCommand, expectSuccess, GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { expectDestroyedDrawsExactly } from "../../../test-helpers/unit-trigger-behavior-test-helpers.ts";
import { eb01Haro017 } from "./017-haro.ts";

describe("Haro (EB01-017)", () => {
  it("【Destroyed】 draws 1 for both controllers after enemy battle damage destroys it", () => {
    expectDestroyedDrawsExactly(eb01Haro017, 1, { destroyerDraws: 1 });
  });

  it("does not draw when an effect, rather than battle damage, destroys it", () => {
    const destroyByEffect = createMockCommand({
      level: 0,
      cost: 0,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "dealDamage",
                amount: eb01Haro017.hp,
                target: { owner: "friendly", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "Choose 1 friendly Unit. Deal damage equal to its HP.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [destroyByEffect],
      play: [eb01Haro017],
      deck: 2,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const haroId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(destroyByEffect, { targets: [haroId] }));

    expect(p1.getCardZone(haroId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(2);
  });
});
