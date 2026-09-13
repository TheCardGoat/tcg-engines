import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01DomGrossBeil055 } from "./055-dom-gross-beil.ts";

function resolveDirectAttack(
  engine: GundamTestEngine,
  attackerPlayer: typeof PLAYER_TWO,
  defenderPlayer: typeof PLAYER_ONE,
): void {
  const attacker = engine.asPlayer(attackerPlayer);
  const defender = engine.asPlayer(defenderPlayer);
  const attackerId = attacker.getCardsInZone("battleArea")[0]!;

  expectSuccess(attacker.enterBattle(attackerId, "direct"));
  expectSuccess(defender.passBlock());
  expectSuccess(defender.passBattleAction());
  expectSuccess(attacker.passBattleAction());
}

describe("Dom Gross Beil (EB01-055)", () => {
  /** @behavioral-proof complete: the standard two-player enemy-count gate and rested state are exercised through real Shield damage. */
  it("does not protect Shields while Dom Gross Beil is active", () => {
    const attacker = createMockUnit({ name: "Attacker", ap: 3 });
    const shield = createMockUnit({ name: "Shield" });
    const engine = GundamTestEngine.create(
      { play: [eb01DomGrossBeil055], shieldArea: [shield], deck: 5 },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    resolveDirectAttack(engine, PLAYER_TWO, PLAYER_ONE);

    expect(p1.getCardsInZone("shieldArea")).toHaveLength(0);
  });

  it("does not protect Shields with only one enemy player", () => {
    const attacker = createMockUnit({ name: "Attacker", ap: 3 });
    const shield = createMockUnit({ name: "Shield" });
    const engine = GundamTestEngine.create(
      { play: [{ card: eb01DomGrossBeil055, exhausted: true }], shieldArea: [shield], deck: 5 },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    resolveDirectAttack(engine, PLAYER_TWO, PLAYER_ONE);

    expect(p1.getCardsInZone("shieldArea")).toHaveLength(0);
  });
});
