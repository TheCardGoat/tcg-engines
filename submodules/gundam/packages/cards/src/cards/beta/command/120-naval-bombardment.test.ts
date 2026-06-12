import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  findStatModifier,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaNavalBombardment120 } from "./120-naval-bombardment.ts";
describe("Naval Bombardment (GD01-120, beta reprint)", () => {
  it("【Burst】Choose 1 enemy Unit. It gets AP-3 during this turn.", () => {
    const enemy = createMockUnit({ ap: 5, hp: 5 });
    const engine = GundamTestEngine.create({ deck: [betaNavalBombardment120] }, { play: [enemy] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, betaNavalBombardment120.cardNumber, asPlayerId(PLAYER_ONE));

    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    engine.fireShieldBurst(shieldId);

    expect(findStatModifier(engine, enemyId!, "ap")?.modifier).toBe(-3);
  });

  describe("【Action】Choose 1 friendly Unit with <Blocker>. It gets AP+3 during this turn.", () => {
    it("applies AP+3 to a friendly Blocker unit", () => {
      const blocker = createMockUnit({
        ap: 2,
        hp: 5,
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const engine = GundamTestEngine.create({
        hand: [betaNavalBombardment120],
        resourceArea: activeResources(2),
        play: [blocker],
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(betaNavalBombardment120, { targets: [unitId!] }));

      expect(findStatModifier(engine, unitId!, "ap")?.modifier).toBe(3);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target a friendly unit without Blocker", () => {
      const plain = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [betaNavalBombardment120],
        resourceArea: activeResources(2),
        play: [plain],
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(betaNavalBombardment120, { targets: [unitId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
