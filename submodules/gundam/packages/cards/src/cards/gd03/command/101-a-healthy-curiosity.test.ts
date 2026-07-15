import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03AHealthyCuriosity101 } from "./101-a-healthy-curiosity.ts";
import { st08LaneAim011 } from "../../st08/pilot/011-lane-aim.ts";

function healthyCuriosityCopy() {
  return createMockCommand({ name: "A Healthy Curiosity (Alternate Art)" });
}

describe("A Healthy Curiosity (GD03-101)", () => {
  it("draws before offering an eligible enemy Unit when two named copies are in trash", () => {
    const eligibleEnemy = createMockUnit({ name: "Eligible Enemy", hp: 4 });
    const highHpEnemy = createMockUnit({ name: "High-HP Enemy", hp: 5 });
    const drawnCard = createMockUnit({ name: "Drawn Card" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AHealthyCuriosity101],
        trash: [healthyCuriosityCopy(), healthyCuriosityCopy()],
        resourceArea: activeResources(3),
        deck: [createMockUnit({ name: "Bottom Sentinel" }), drawnCard],
      },
      { play: [eligibleEnemy, highHpEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const [eligibleEnemyId, highHpEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(commandId));

    expect(p1.getCardZone(drawnCard)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: commandId,
      legalTargetIds: [eligibleEnemyId],
    });
    expect(p1.getCardZone(commandId)).toBe("removalArea");
    expect(p1.getBoardView().pendingChoice).not.toMatchObject({
      legalTargetIds: expect.arrayContaining([highHpEnemyId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleEnemyId!] }));

    expect(p2.isExhausted(eligibleEnemyId!)).toBe(true);
    expect(p2.isExhausted(highHpEnemyId!)).toBe(false);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("offers the Then target before draw-triggered same-controller effects", () => {
    const blueHost = createMockUnit({ name: "Blue Host", color: "blue", hp: 4 });
    const eligibleEnemy = createMockUnit({ name: "Eligible Enemy", hp: 4 });
    const drawnCard = createMockUnit({ name: "Drawn Card" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AHealthyCuriosity101, st08LaneAim011],
        play: [blueHost],
        trash: [healthyCuriosityCopy(), healthyCuriosityCopy()],
        resourceArea: activeResources(4),
        deck: [createMockUnit({ name: "Bottom Sentinel" }), drawnCard],
      },
      { play: [eligibleEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(st08LaneAim011, hostId));
    const commandId = p1.getHand()[0]!;
    expectSuccess(p1.playCommand(commandId));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: commandId,
      legalTargetIds: [enemyId],
    });

    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.isExhausted(enemyId)).toBe(true);
    expect(p1.getVisibleCard(hostId)?.keywords).toContain("HighManeuver");
  });

  it("draws without asking for a target when fewer than two named copies are in trash", () => {
    const enemy = createMockUnit({ hp: 4 });
    const drawnCard = createMockUnit({ name: "Drawn Card" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AHealthyCuriosity101],
        trash: [healthyCuriosityCopy()],
        resourceArea: activeResources(3),
        deck: [createMockUnit({ name: "Bottom Sentinel" }), drawnCard],
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(commandId));

    expect(p1.getCardZone(drawnCard)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(enemyId)).toBe(false);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("draws without asking for a target when every enemy Unit has more than 4 HP", () => {
    const highHpEnemy = createMockUnit({ hp: 5 });
    const drawnCard = createMockUnit({ name: "Drawn Card" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AHealthyCuriosity101],
        trash: [healthyCuriosityCopy(), healthyCuriosityCopy()],
        resourceArea: activeResources(3),
        deck: [createMockUnit({ name: "Bottom Sentinel" }), drawnCard],
      },
      { play: [highHpEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(commandId));

    expect(p1.getCardZone(drawnCard)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(enemyId)).toBe(false);
    expectSuccess(p1.passPhase());
  });

  it("ends the game after drawing the last card without publishing a rest target", () => {
    const eligibleEnemy = createMockUnit({ name: "Eligible Enemy", hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AHealthyCuriosity101],
        trash: [healthyCuriosityCopy(), healthyCuriosityCopy()],
        resourceArea: activeResources(3),
        deck: [createMockUnit({ name: "Last Card" })],
      },
      { play: [eligibleEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(commandId));

    expect(p1.getCardsInZone("deck")).toHaveLength(0);
    expect(p1.getBoardView().winner).toBe(PLAYER_TWO);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(enemyId)).toBe(false);
  });
});
