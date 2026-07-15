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
import { gd03VeteranTactics122 } from "./122-veteran-tactics.ts";

describe("Veteran Tactics (GD03-122)", () => {
  it("【Action】 returns an enemy Lv.3 or lower Unit to its owner's hand", () => {
    const lowLevel = createMockUnit({ level: 3 });
    const highLevel = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03VeteranTactics122], resourceArea: activeResources(2) },
      { play: [lowLevel, highLevel] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const [lowLevelId, highLevelId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(commandId, { targets: [lowLevelId!] }));

    expect(p2.getHand()).toContain(lowLevelId);
    expect(p2.getCardsInZone("battleArea")).toContain(highLevelId);
  });

  it("cannot target an enemy Unit above Lv.3", () => {
    const highLevel = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03VeteranTactics122], resourceArea: activeResources(2) },
      { play: [highLevel] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const highLevelId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectFailure(p1.playCommand(commandId, { targets: [highLevelId] }), "INVALID_TARGET");
  });

  it("cannot be played during Main timing", () => {
    const lowLevel = createMockUnit({ level: 3 });
    const engine = GundamTestEngine.create(
      { hand: [gd03VeteranTactics122], resourceArea: activeResources(2) },
      { play: [lowLevel] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const lowLevelId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.playCommand(commandId, { targets: [lowLevelId] }), "WRONG_TIMING");
  });

  it("can be played as Sergei Smirnov and visibly grants HP+1", () => {
    const host = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({
      hand: [gd03VeteranTactics122],
      play: [host],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 2, effectiveHp: 4 });
  });
});
