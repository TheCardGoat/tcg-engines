import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockUnit,
  expectSuccess,
  markAsLinkUnit,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03PrivilegedPosition102 } from "./102-privileged-position.ts";

describe("Privileged Position (GD03-102)", () => {
  it("【Burst】 draws 1 card", () => {
    const engine = GundamTestEngine.create({ deck: [gd03PrivilegedPosition102, createMockUnit()] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd03PrivilegedPosition102.cardNumber, asPlayerId(PLAYER_ONE));
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    engine.fireShieldBurst(shieldId);

    expect(p1.getHand().length).toBe(handBefore + 1);
  });

  it("【Action】 sets a battling friendly Titans Link Unit as active", () => {
    const titans = { card: createMockUnit({ traits: ["titans"] }), exhausted: true };
    const enemy = createMockUnit();
    const engine = GundamTestEngine.create(
      { hand: [gd03PrivilegedPosition102], play: [titans], resourceArea: activeResources(6) },
      { play: [enemy] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const titansId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
    markAsLinkUnit(engine, titansId);
    engine.getG().turnMetadata.pendingCombat = {
      stage: "action-step",
      attackerId: titansId,
      attackerPlayerId: PLAYER_ONE,
      target: enemyId,
    };

    expectSuccess(p1.playCommand(gd03PrivilegedPosition102, { targets: [titansId] }));

    expect(engine.getG().exhausted[titansId]).not.toBe(true);
  });
});
