import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  activeResources,
} from "@tcg/gundam-engine";
import { betaInterceptOrders099 } from "./099-intercept-orders.ts";
describe("Intercept Orders (GD01-099, beta reprint)", () => {
  it("【Burst】Choose 1 enemy Unit with 5 or less HP. Rest it.", () => {
    const u1 = createMockUnit({ ap: 1, hp: 5 });
    const u2 = createMockUnit({ ap: 1, hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [u1, u2] },
      { shieldArea: [betaInterceptOrders099] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [u1Id, u2Id] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(u2Id!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: expect.any(String),
      legalTargetIds: [u1Id],
    });
    expectSuccess(p2.resolveEffect({ targets: [u1Id!] }));

    expect(p1.isExhausted(u1Id!)).toBe(true);
  });

  describe("【Main】/【Action】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.", () => {
    it("rests one chosen enemy unit", () => {
      const u1 = createMockUnit({ ap: 1, hp: 3 });
      const u2 = createMockUnit({ ap: 1, hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [betaInterceptOrders099], resourceArea: activeResources(4) },
        { play: [u1, u2] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [u1Id, u2Id] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(betaInterceptOrders099, { targets: [u1Id!] }));
      expect(p2.isExhausted(u1Id!)).toBe(true);
      expect(p2.isExhausted(u2Id!)).toBe(false);
    });

    it("rests two chosen enemy units", () => {
      const u1 = createMockUnit({ ap: 1, hp: 3 });
      const u2 = createMockUnit({ ap: 1, hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [betaInterceptOrders099], resourceArea: activeResources(4) },
        { play: [u1, u2] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [u1Id, u2Id] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(betaInterceptOrders099, { targets: [u1Id!, u2Id!] }));
      expect(p2.isExhausted(u1Id!)).toBe(true);
      expect(p2.isExhausted(u2Id!)).toBe(true);
    });
  });
});
