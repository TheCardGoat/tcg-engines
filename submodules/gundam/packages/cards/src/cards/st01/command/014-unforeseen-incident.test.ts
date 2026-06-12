import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  expectSuccess,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  findStatModifier,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st01UnforeseenIncident014 } from "./014-unforeseen-incident.ts";
describe("Unforeseen Incident (ST01-014)", () => {
  it("【Burst】Activate this card's 【Main】 — applies AP-3 to an enemy Unit.", () => {
    const enemy = createMockUnit({ ap: 5, hp: 4 });
    const engine = GundamTestEngine.create(
      { deck: [st01UnforeseenIncident014] },
      { play: [enemy] },
    );
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, st01UnforeseenIncident014.cardNumber, asPlayerId(PLAYER_ONE));

    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    engine.fireShieldBurst(shieldId);

    expect(findStatModifier(engine, enemyId!, "ap")?.modifier).toBe(-3);
  });

  describe("【Main】/【Action】Choose 1 enemy Unit. It gets AP-3 during this turn.", () => {
    it("applies an AP-3 continuous effect to the targeted enemy", () => {
      const enemy = createMockUnit({ ap: 5, hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [st01UnforeseenIncident014], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(st01UnforeseenIncident014, { targets: [enemyId!] }));

      const mod = findStatModifier(engine, enemyId!, "ap");
      expect(mod?.modifier).toBe(-3);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("is playable at action-phase timing", () => {
      const enemy = createMockUnit({ ap: 4, hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st01UnforeseenIncident014], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(st01UnforeseenIncident014, { targets: [enemyId!] }));
      expect(findStatModifier(engine, enemyId!, "ap")?.modifier).toBe(-3);
    });
  });
});
