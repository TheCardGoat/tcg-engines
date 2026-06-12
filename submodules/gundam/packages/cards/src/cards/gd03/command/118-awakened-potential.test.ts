import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
  getEffectiveStats,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03AwakenedPotential118 } from "./118-awakened-potential.ts";

function awakenedPotentialCopy() {
  return createMockCommand({ name: "Awakened Potential" });
}

describe("Awakened Potential (GD03-118)", () => {
  it("has the printed command identity", () => {
    expect(gd03AwakenedPotential118.type).toBe("command");
    expect(gd03AwakenedPotential118.cardNumber).toBe("GD03-118");
  });

  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03AwakenedPotential118] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_TWO).getHand()).toContain(shieldId);
  });

  it("【Action】 returns a rested enemy Unit that is Lv.4 or lower to hand", () => {
    const enemy = { card: createMockUnit({ level: 4 }), exhausted: true };
    const engine = GundamTestEngine.create(
      { hand: [gd03AwakenedPotential118], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03AwakenedPotential118, { targets: [enemyId] }));

    expect(p2.getHand()).toContain(enemyId);
  });

  it("with two Awakened Potential cards in trash, may grant <Blocker> to a friendly Unit", () => {
    const friendly = createMockUnit({ hp: 4 });
    const enemy = { card: createMockUnit({ level: 4 }), exhausted: true };
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AwakenedPotential118],
        trash: [awakenedPotentialCopy(), awakenedPotentialCopy()],
        play: [friendly],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03AwakenedPotential118, { targets: [enemyId, friendlyId] }));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 1: true } }));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(
      getEffectiveStats(friendlyId, engine.getG(), framework.cards, framework).keywords,
    ).toContain("Blocker");
  });

  it("cannot target an active enemy Unit", () => {
    const enemy = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03AwakenedPotential118], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd03AwakenedPotential118, { targets: [enemyId] }),
      "INVALID_TARGET",
    );
  });
});
