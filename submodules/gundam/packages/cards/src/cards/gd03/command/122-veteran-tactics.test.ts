import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03VeteranTactics122 } from "./122-veteran-tactics.ts";

describe("Veteran Tactics (GD03-122)", () => {
  it("【Action】 returns an enemy Lv.3 or lower Unit to its owner's hand", () => {
    const lowLevel = createMockUnit({ level: 3 });
    const highLevel = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03VeteranTactics122], resourceArea: activeResources(2) },
      { play: [lowLevel, highLevel] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [lowLevelId, highLevelId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(gd03VeteranTactics122, { targets: [lowLevelId!] }));

    expect(p2.getCardsInZone("hand")).toContain(lowLevelId);
    expect(p2.getCardsInZone("battleArea")).toContain(highLevelId);
  });

  it("cannot target an enemy Unit above Lv.3", () => {
    const highLevel = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03VeteranTactics122], resourceArea: activeResources(2) },
      { play: [highLevel] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const highLevelId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd03VeteranTactics122, { targets: [highLevelId] }),
      "INVALID_TARGET",
    );
  });

  it("cannot be played during main phase because it is action-only", () => {
    const lowLevel = createMockUnit({ level: 3 });
    const engine = GundamTestEngine.create(
      { hand: [gd03VeteranTactics122], resourceArea: activeResources(2) },
      { play: [lowLevel] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const lowLevelId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(p1.playCommand(gd03VeteranTactics122, { targets: [lowLevelId] }), "WRONG_TIMING");
  });
});
