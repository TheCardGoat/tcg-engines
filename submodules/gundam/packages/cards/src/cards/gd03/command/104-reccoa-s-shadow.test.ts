import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import { gd03ReccoaSShadow104 } from "./104-reccoa-s-shadow.ts";

describe("Reccoa's Shadow (GD03-104)", () => {
  it("【Main】 rests an enemy Unit with 3 or less HP", () => {
    const enemy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [gd03ReccoaSShadow104], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03ReccoaSShadow104, { targets: [enemyId] }));

    expect(engine.getG().exhausted[enemyId]).toBe(true);
  });

  it("also works during the action step", () => {
    const enemy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [gd03ReccoaSShadow104], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03ReccoaSShadow104, { targets: [enemyId] }));

    expect(engine.getG().exhausted[enemyId]).toBe(true);
  });

  it("cannot target an enemy Unit with more than 3 HP", () => {
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03ReccoaSShadow104], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(p1.playCommand(gd03ReccoaSShadow104, { targets: [enemyId] }), "INVALID_TARGET");
  });

  it("with a friendly Jupitris Link Unit, can choose 1 to 2 enemy Units instead", () => {
    const jupitrisUnit = createMockUnit({ traits: ["jupitris"] });
    const enemyA = createMockUnit({ hp: 3 });
    const enemyB = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03ReccoaSShadow104],
        play: [jupitrisUnit],
        resourceArea: activeResources(3),
      },
      { play: [enemyA, enemyB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const jupitrisId = p1.getCardsInZone("battleArea")[0]!;
    const [enemyAId, enemyBId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");
    markAsLinkUnit(engine, jupitrisId);

    expectSuccess(p1.playCommand(gd03ReccoaSShadow104, { targets: [enemyAId!, enemyBId!] }));

    expect(engine.getG().exhausted[enemyAId!]).toBe(true);
    expect(engine.getG().exhausted[enemyBId!]).toBe(true);
  });
});
