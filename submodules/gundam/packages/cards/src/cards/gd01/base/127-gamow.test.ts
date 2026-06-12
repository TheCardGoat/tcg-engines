import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01Gamow127 } from "./127-gamow.ts";

describe("Gamow (GD01-127)", () => {
  it("【Deploy】Add 1 of your Shields to your hand.", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd01Gamow127], resourceArea: activeResources(2), deck: 4 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(gd01Gamow127));

    // Base leaves hand (-1), shield top added (+1) → net 0.
    expect(p1.getHand().length).toBe(handBefore);
    expect(p1.getHand()).toContain(shieldIds[0]);
  });

  it("【Activate･Action】 grants <Breach 3> only to the chosen (ZAFT) Unit", () => {
    // Two ZAFT friendlies with AP >= 5 — the activate caller must pick one.
    // Pre-fix, grantKeyword routed through raw `evaluateTargetFilter` which
    // buffed every candidate.
    const zaft1 = createMockUnit({ ap: 6, hp: 4, traits: ["zaft"] });
    const zaft2 = createMockUnit({ ap: 6, hp: 4, traits: ["zaft"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Gamow127],
        resourceArea: activeResources(2),
        play: [zaft1, zaft2],
        deck: 4,
      },
      {},
    );
    seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployBase(gd01Gamow127));

    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const [zaft1Id, zaft2Id] = p1.getCardsInZone("battleArea");
    if (!zaft1Id || !zaft2Id) throw new Error("setup failed");

    // Move to end-phase / action-step so activate:action is legal.
    engine.setPhase("end-phase");
    engine.setStep("action-step");

    // Only the Activate･Action effect is in the activated-effects list.
    expectSuccess(p1.activateAbility(baseId, 0, { targets: [zaft1Id] }));

    // Base rested as cost.
    expect(engine.getG().exhausted[baseId]).toBe(true);

    const breachEffects = engine
      .getG()
      .continuousEffects.filter(
        (e) => e.payload.kind === "keyword-grant" && e.payload.keyword === "Breach",
      );
    expect(breachEffects).toHaveLength(1);
    expect(breachEffects[0]!.targetId).toBe(zaft1Id);
    expect(breachEffects.find((e) => e.targetId === zaft2Id)).toBeUndefined();
  });
});
