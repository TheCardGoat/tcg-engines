import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Messala003 } from "./003-messala.ts";
import { gd03GundamHeavyarmsCustom029 } from "./029-gundam-heavyarms-custom.ts";

describe("Gundam Heavyarms Custom (GD03-029)", () => {
  it("during your turn, when this Unit destroys an enemy Unit by battle damage, deals 2 to all enemy Blocker Units", () => {
    // Heavyarms (AP 4) attacks a 1-HP defender → defender dies.
    // The new `onDestroyByBattle` event fires on the attacker, gated on
    // isTurn:friendly. Two other enemy Blockers in play take 2 each.
    const fragileDefender = createMockUnit({ ap: 1, hp: 1 });
    const nonBlocker = createMockUnit({ ap: 2, hp: 4 });

    const engine = GundamTestEngine.create(
      { play: [gd03GundamHeavyarmsCustom029] },
      {
        play: [
          { card: fragileDefender, exhausted: true },
          gd03Messala003,
          gd03Messala003,
          nonBlocker,
        ],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, blocker1Id, blocker2Id, nonBlockerId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(attackerId, defenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    // Both Blockers took 2 damage from the trigger.
    expect(p2.getDamage(blocker1Id!)).toBe(2);
    expect(p2.getDamage(blocker2Id!)).toBe(2);
    // Non-Blocker enemy untouched.
    expect(p2.getDamage(nonBlockerId!)).toBe(0);
  });

  it("does NOT fire when the defender is NOT destroyed (e.g. AP < HP)", () => {
    const sturdyDefender = createMockUnit({ ap: 1, hp: 8 });
    const engine = GundamTestEngine.create(
      { play: [gd03GundamHeavyarmsCustom029] },
      { play: [{ card: sturdyDefender, exhausted: true }, gd03Messala003] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, blockerId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(attackerId, defenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    // Defender survived (4 damage, 8 HP) — the trigger never fires.
    expect(p2.getDamage(blockerId!)).toBe(0);
  });

  it("does not damage enemy Blockers when it destroys an attacker on the opponent's turn", () => {
    const fragileAttacker = createMockUnit({ ap: 1, hp: 1 });
    const transitionDefender = createMockUnit({ ap: 0, hp: 10 });
    const engine = GundamTestEngine.create(
      { play: [gd03GundamHeavyarmsCustom029], deck: 5 },
      {
        play: [fragileAttacker, { card: transitionDefender, exhausted: true }, gd03Messala003],
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const heavyarmsId = p1.getCardsInZone("battleArea")[0]!;
    const [attackerId, transitionDefenderId, blockerId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(heavyarmsId, transitionDefenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expectSuccess(p2.enterBattle(attackerId!, heavyarmsId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p2.getCardZone(attackerId!)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getDamage(blockerId!)).toBe(0);
  });
});
