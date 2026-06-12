import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd03TowardsDestiny116 } from "./116-towards-destiny.ts";

describe("Towards Destiny (GD03-116)", () => {
  it("【Main】 deals 2 damage to a friendly Vagan Unit and an enemy Unit", () => {
    const vagan = createMockUnit({ traits: ["vagan"], hp: 4 });
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03TowardsDestiny116],
        play: [vagan],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const vaganId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03TowardsDestiny116, { targets: [vaganId, enemyId] }));

    expect(getDamageCounter(engine, vaganId)).toBe(2);
    expect(getDamageCounter(engine, enemyId)).toBe(2);
  });

  it("also works during the action step", () => {
    const vagan = createMockUnit({ traits: ["vagan"], hp: 4 });
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03TowardsDestiny116],
        play: [vagan],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const vaganId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03TowardsDestiny116, { targets: [vaganId, enemyId] }));

    expect(getDamageCounter(engine, vaganId)).toBe(2);
    expect(getDamageCounter(engine, enemyId)).toBe(2);
  });

  it("cannot target a non-Vagan friendly Unit for the first damage", () => {
    const nonVagan = createMockUnit({ traits: ["earth federation"], hp: 4 });
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03TowardsDestiny116],
        play: [nonVagan],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const nonVaganId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd03TowardsDestiny116, { targets: [nonVaganId, enemyId] }),
      "INVALID_TARGET",
    );
  });
});
