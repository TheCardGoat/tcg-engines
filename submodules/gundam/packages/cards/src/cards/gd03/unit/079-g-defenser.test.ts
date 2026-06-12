import { describe, it, expect } from "vite-plus/test";
import type { BaseCard, UnitCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  expectSuccess,
  isCardExhausted,
} from "@tcg/gundam-engine";
import { gd03GDefenser079 } from "./079-g-defenser.ts";

describe("G-Defenser (GD03-079)", () => {
  it("may rest this Unit instead when a Unit effect would rest your Base", () => {
    const base: BaseCard = {
      cardNumber: "TEST-BASE",
      name: "Test Base",
      type: "base",
      traits: ["aeug"],
      level: 1,
      cost: 0,
      hp: 5,
      effects: [],
      keywordEffects: [],
      rarity: "common",
    };
    const enemy = createMockUnit({ level: 1, hp: 3 });
    const baseRestUnit: UnitCard = createMockUnit({
      name: "Base Rest Unit",
      effects: [
        {
          type: "triggered",
          activation: { timing: ["attack"] },
          directives: [
            {
              action: {
                action: "rest",
                target: { owner: "friendly", cardType: "base", state: "active", count: 1 },
              },
            },
          ],
          sourceText: "【Attack】Choose 1 active friendly Base. Rest it.",
        },
      ],
    });
    const engine = GundamTestEngine.create(
      { play: [baseRestUnit, gd03GDefenser079], baseSection: [base] },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [attackerId, gDefenserId] = p1.getCardsInZone("battleArea");
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = engine.asPlayer("player_two").getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId!, enemyId));

    expect(isCardExhausted(engine, gDefenserId!)).toBe(true);
    expect(isCardExhausted(engine, baseId)).toBe(false);
  });
});
