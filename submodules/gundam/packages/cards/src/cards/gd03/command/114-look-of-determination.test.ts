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
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03LookOfDetermination114 } from "./114-look-of-determination.ts";

function trashCards(count: number) {
  return Array.from({ length: count }, (_, i) => createMockCommand({ name: `Trash ${i}` }));
}

describe("Look of Determination (GD03-114)", () => {
  it("【Action】 destroys an active enemy Unit that is Lv.2 or lower", () => {
    const enemy = createMockUnit({ level: 2 });
    const engine = GundamTestEngine.create(
      { hand: [gd03LookOfDetermination114], resourceArea: activeResources(2) },
      { play: [enemy] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03LookOfDetermination114, { targets: [enemyId] }));

    expect(p2.getCardsInZone("trash")).toContain(enemyId);
  });

  it("cannot target an enemy Unit above Lv.2 without the trash threshold clause", () => {
    const enemy = createMockUnit({ level: 3 });
    const engine = GundamTestEngine.create(
      { hand: [gd03LookOfDetermination114], resourceArea: activeResources(2) },
      { play: [enemy] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd03LookOfDetermination114, { targets: [enemyId] }),
      "INVALID_TARGET",
    );
  });

  it("【Burst】 activates this card's Action timing", () => {
    const enemy = createMockUnit({ level: 2 });
    const engine = GundamTestEngine.create(
      { play: [enemy] },
      { deck: [gd03LookOfDetermination114] },
    );
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    const enemyId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    engine.fireShieldBurst(shieldId, { targets: [enemyId] });

    expect(engine.asPlayer(PLAYER_ONE).getCardsInZone("trash")).toContain(enemyId);
  });

  it("with 10 or more cards in trash, destroys an active enemy Unit that is Lv.4 or lower", () => {
    const enemy = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03LookOfDetermination114],
        trash: trashCards(10),
        resourceArea: activeResources(2),
      },
      { play: [enemy] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03LookOfDetermination114, { targets: [enemyId] }));

    expect(p2.getCardsInZone("trash")).toContain(enemyId);
  });

  it("still rejects an enemy Unit above Lv.4 with 10 or more cards in trash", () => {
    const enemy = createMockUnit({ level: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03LookOfDetermination114],
        trash: trashCards(10),
        resourceArea: activeResources(2),
      },
      { play: [enemy] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd03LookOfDetermination114, { targets: [enemyId] }),
      "INVALID_TARGET",
    );
  });
});
