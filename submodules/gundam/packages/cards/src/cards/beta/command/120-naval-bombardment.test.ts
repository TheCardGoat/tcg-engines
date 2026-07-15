import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
} from "@tcg/gundam-engine";
import { betaNavalBombardment120 } from "./120-naval-bombardment.ts";
describe("Naval Bombardment (GD01-120, beta reprint)", () => {
  it("【Burst】Choose 1 enemy Unit. It gets AP-3 during this turn.", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      { shieldArea: [betaNavalBombardment120] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: shieldId,
      legalTargetIds: [attackerId],
    });
    expectSuccess(p1.resolveEffect({ targets: [attackerId] }));

    expect(p2.getVisibleCard(attackerId)?.effectiveAp).toBe(2);
  });

  describe("【Action】Choose 1 friendly Unit with <Blocker>. It gets AP+3 during this turn.", () => {
    it("applies AP+3 to a friendly Blocker unit", () => {
      const blocker = createMockUnit({
        ap: 2,
        hp: 5,
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [betaNavalBombardment120],
          resourceArea: activeResources(2),
          play: [blocker],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [unitId] = p1.getCardsInZone("battleArea");
      const [attackerId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p2.enterBattle(attackerId!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(betaNavalBombardment120, { targets: [unitId!] }));

      expect(p1.getVisibleCard(unitId!)?.effectiveAp).toBe(5);
      expect(p1.getCardZone(cmdId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("cannot target a friendly unit without Blocker", () => {
      const plain = createMockUnit({ ap: 2, hp: 5 });
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [betaNavalBombardment120],
          resourceArea: activeResources(2),
          play: [plain],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [unitId] = p1.getCardsInZone("battleArea");
      const [attackerId] = p2.getCardsInZone("battleArea");

      expectSuccess(p2.enterBattle(attackerId!, "direct"));
      expectSuccess(p1.passBlock());
      expectFailure(
        p1.playCommand(betaNavalBombardment120, { targets: [unitId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
