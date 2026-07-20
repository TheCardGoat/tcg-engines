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
  restedResources,
} from "@tcg/gundam-engine";
import { st08LaneAim011 } from "./011-lane-aim.ts";

describe("Lane Aim (ST08-011)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [st08LaneAim011] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burst = p2.getBoardView().pendingChoice;
    if (burst?.kind !== "optional") throw new Error("Expected visible Burst choice");
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

    expect(p2.getHand()).toContain(burst.sourceCardId);
  });

  it("declines Burst and puts itself in trash", () => {
    const engine = GundamTestEngine.create(
      { play: [createMockUnit()] },
      { shieldArea: [st08LaneAim011] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burst = p2.getBoardView().pendingChoice;
    if (burst?.kind !== "optional") throw new Error("Expected visible Burst choice");
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));
    expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
  });

  describe("When you draw with an effect, if this is a blue Unit, it gains <High-Maneuver> during this turn.", () => {
    it("grants High-Maneuver to the paired blue Unit after you draw with an effect", () => {
      const host = createMockUnit({ color: "blue", ap: 2, hp: 4 });
      const drawCommand = createMockCommand({
        effect: "【Main】Draw 1.",
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [{ action: { action: "draw", count: 1 } }],
            sourceText: "【Main】Draw 1.",
          },
        ],
      });
      const engine = GundamTestEngine.create({
        hand: [st08LaneAim011, drawCommand],
        play: [host],
        resourceArea: activeResources(4),
        deck: 2,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [hostId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(st08LaneAim011, host));
      expectSuccess(p1.playCommand(drawCommand));

      expect(p1.getVisibleCard(hostId!)?.keywords).toContain("HighManeuver");
    });

    it("does not grant High-Maneuver when the paired Unit is not blue", () => {
      const host = createMockUnit({ color: "red", ap: 2, hp: 4 });
      const drawCommand = createMockCommand({
        effect: "【Main】Draw 1.",
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [{ action: { action: "draw", count: 1 } }],
            sourceText: "【Main】Draw 1.",
          },
        ],
      });
      const engine = GundamTestEngine.create({
        hand: [st08LaneAim011, drawCommand],
        play: [host],
        resourceArea: activeResources(4),
        deck: 2,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [hostId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(st08LaneAim011, host));
      expectSuccess(p1.playCommand(drawCommand));

      expect(p1.getVisibleCard(hostId!)?.keywords).not.toContain("HighManeuver");
    });

    it("does not trigger when the opponent draws with an effect", () => {
      const host = createMockUnit({ color: "blue" });
      const draw = createMockCommand({
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [{ action: { action: "draw", count: 1 } }],
            sourceText: "Draw 1.",
          },
        ],
      });
      const engine = GundamTestEngine.create(
        { hand: [st08LaneAim011], play: [host], resourceArea: activeResources(4), deck: 5 },
        { hand: [draw], resourceArea: activeResources(1), deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st08LaneAim011, hostId));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.playCommand(draw));
      expect(p1.getVisibleCard(hostId)?.keywords).not.toContain("HighManeuver");
    });

    it("prevents an enemy Unit from blocking after the effect draw", () => {
      const host = createMockUnit({ color: "blue", hp: 5 });
      const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }], hp: 5 });
      const draw = createMockCommand({
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [{ action: { action: "draw", count: 1 } }],
            sourceText: "Draw 1.",
          },
        ],
      });
      const engine = GundamTestEngine.create(
        { hand: [st08LaneAim011, draw], play: [host], resourceArea: activeResources(4), deck: 5 },
        { play: [blocker], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st08LaneAim011, hostId));
      expectSuccess(p1.playCommand(draw));
      expectSuccess(p1.enterBattle(hostId, "direct"));
      expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
    });

    it("expires High-Maneuver at the end of the turn", () => {
      const host = createMockUnit({ color: "blue" });
      const draw = createMockCommand({
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [{ action: { action: "draw", count: 1 } }],
            sourceText: "Draw 1.",
          },
        ],
      });
      const engine = GundamTestEngine.create(
        { hand: [st08LaneAim011, draw], play: [host], resourceArea: activeResources(4), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st08LaneAim011, hostId));
      expectSuccess(p1.playCommand(draw));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expect(p1.getVisibleCard(hostId)?.keywords).not.toContain("HighManeuver");
    });
  });

  it("pairs for Lv.4/cost1 and grants +2 AP/+1 HP", () => {
    const engine = GundamTestEngine.create({
      hand: [st08LaneAim011],
      play: [createMockUnit({ ap: 2, hp: 3 })],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const id = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(st08LaneAim011, id));
    expect(p1.getVisibleCard(id)).toMatchObject({ effectiveAp: 4, effectiveHp: 4 });
  });

  it("requires Lv.4 and one active resource", () => {
    const low = GundamTestEngine.create({
      hand: [st08LaneAim011],
      play: [createMockUnit()],
      resourceArea: activeResources(3),
    });
    const p1 = low.asPlayer(PLAYER_ONE);
    expectFailure(
      p1.assignPilot(st08LaneAim011, p1.getCardsInZone("battleArea")[0]!),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    const rested = GundamTestEngine.create({
      hand: [st08LaneAim011],
      play: [createMockUnit()],
      resourceArea: restedResources(4),
    });
    const controller = rested.asPlayer(PLAYER_ONE);
    expectFailure(
      controller.assignPilot(st08LaneAim011, controller.getCardsInZone("battleArea")[0]!),
      "INSUFFICIENT_RESOURCES",
    );
  });
});
