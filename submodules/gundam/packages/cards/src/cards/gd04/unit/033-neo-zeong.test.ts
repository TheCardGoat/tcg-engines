import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  buildTargetResolutionContext,
  createMockPilot,
  createMockUnit,
  evaluateTargetFilter,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd04NeoZeong033 } from "./033-neo-zeong.ts";

describe("Neo Zeong (GD04-033)", () => {
  it("grants Neo Zeon to friendly Units when linked", () => {
    const fullFrontal = createMockPilot({ name: "Full Frontal", level: 1, cost: 1 });
    const ally = createMockUnit({ name: "Friendly Ally", traits: ["civilian"] });
    const engine = GundamTestEngine.create({
      hand: [fullFrontal],
      play: [gd04NeoZeong033, ally],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [neoZeongId, allyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(fullFrontal, neoZeongId!));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
      sourceCardId: neoZeongId,
    });
    const neoZeonUnits = evaluateTargetFilter(
      {
        owner: "friendly",
        cardType: "unit",
        attributeFilters: [{ attribute: "trait", comparison: "includes", value: "neo zeon" }],
      },
      p1.getCardsInZone("battleArea").map((id) => framework.cards.get(id)!),
      ctx,
    );
    expect(neoZeonUnits).toContain(allyId);
  });

  it("deals 3 damage when another friendly Neo Zeon Unit is deployed", () => {
    const neoZeonUnit = createMockUnit({ name: "Neo Zeon Reinforcement", traits: ["neo zeon"] });
    const enemy = createMockUnit({ name: "Enemy Target", hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [neoZeonUnit],
        play: [gd04NeoZeong033],
        resourceArea: activeResources(9),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(neoZeonUnit));

    expect(getDamageCounter(engine, enemyId)).toBe(3);
  });

  it("deals 3 damage when this Unit is deployed", () => {
    const enemy = createMockUnit({ name: "Enemy Target", hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04NeoZeong033],
        resourceArea: activeResources(9),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd04NeoZeong033));

    expect(getDamageCounter(engine, enemyId)).toBe(3);
  });
});
