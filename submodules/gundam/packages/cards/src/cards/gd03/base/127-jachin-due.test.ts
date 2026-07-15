import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03JachinDue127 } from "./127-jachin-due.ts";

describe("Jachin Due (GD03-127)", () => {
  it("lets its owner deploy it when its Burst is revealed by a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03JachinDue127] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03JachinDue127)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("adds a shield to hand and gives only the chosen ZAFT Unit AP+3 for the turn", () => {
    const zaft = createMockUnit({ cardNumber: "TEST-ZAFT", ap: 2, traits: ["zaft"] });
    const nonZaft = createMockUnit({
      cardNumber: "TEST-NON-ZAFT",
      ap: 2,
      traits: ["earth alliance"],
    });
    const returnedShield = createMockUnit({
      cardNumber: "TEST-RETURNED-SHIELD",
      name: "Returned Shield",
    });
    const engine = GundamTestEngine.create({
      hand: [gd03JachinDue127],
      play: [zaft, nonZaft],
      resourceArea: activeResources(6),
      shieldArea: [returnedShield],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [zaftId, nonZaftId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.deployBase(gd03JachinDue127, { targets: [zaftId!] }));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd03JachinDue127)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(zaftId!)?.effectiveAp).toBe(5);
    expect(p1.getVisibleCard(nonZaftId!)?.effectiveAp).toBe(2);

    expectSuccess(p1.passPhase());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getVisibleCard(zaftId!)?.effectiveAp).toBe(2);
  });

  it("rejects a non-ZAFT Unit as the AP bonus target", () => {
    const nonZaft = createMockUnit({ traits: ["earth alliance"] });
    const engine = GundamTestEngine.create({
      hand: [gd03JachinDue127],
      play: [nonZaft],
      resourceArea: activeResources(6),
      shieldArea: [createMockUnit({ name: "Shield" })],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const nonZaftId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.deployBase(gd03JachinDue127, { targets: [nonZaftId] }), "INVALID_TARGET");
    expect(p1.getCardZone(gd03JachinDue127)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(nonZaftId)?.effectiveAp).toBe(2);
  });
});
