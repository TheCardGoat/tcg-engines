import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectAttackRedirectedTo,
  expectSuccess,
  createMockUnit,
} from "@tcg/gundam-engine";
import { st01DemiTrainer008 } from "./008-demi-trainer.ts";

describe("Demi Trainer (ST01-008)", () => {
  it("has the <Blocker> keyword in card data", () => {
    expect(st01DemiTrainer008.keywordEffects?.some((k) => k.keyword === "Blocker")).toBe(true);
  });

  it("<Blocker> lets Demi Trainer intercept an attack targeted at another friendly Unit", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [defender, st01DemiTrainer008] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    // Demi Trainer's <Blocker> re-targets the attack onto itself.
    expectSuccess(p2.declareBlock(blockerId));

    // Assertion helper consolidates the three pendingCombat fields
    // (blockerId, stage=blocker-declared, original target preserved).
    expectAttackRedirectedTo(engine, blockerId);
    expect(engine.getG().turnMetadata.pendingCombat?.target).toBe(defenderId);
  });
});
