import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectAttackRedirectedTo,
  expectSuccess,
  createMockUnit,
} from "@tcg/gundam-engine";
import { betaDemiTrainer008 } from "./008-demi-trainer.ts";

describe("Demi Trainer (ST01-008)", () => {
  it("<Blocker> lets Demi Trainer intercept an attack targeted at another friendly Unit", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [defender, betaDemiTrainer008] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    // Demi Trainer re-targets the attack onto itself via <Blocker>.
    expectSuccess(p2.declareBlock(blockerId));
    expectAttackRedirectedTo(engine, blockerId);
  });
});
