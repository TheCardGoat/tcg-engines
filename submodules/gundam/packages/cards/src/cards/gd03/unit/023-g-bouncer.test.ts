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
} from "@tcg/gundam-engine";
import { gd03AsemuAsuno088 } from "../pilot/088-asemu-asuno.ts";
import { gd03Messala003 } from "./003-messala.ts";
import { gd03GundamAge2Normal019 } from "./019-gundam-age-2-normal.ts";
import { gd03GBouncer023 } from "./023-g-bouncer.ts";

describe("G-Bouncer (GD03-023)", () => {
  /** @behavioral-proof complete: EX Resource controller, AGE System target, duration, and High-Maneuver combat are public. */
  it("when an EX Resource is placed, grants High-Maneuver to a friendly AGE System Unit", () => {
    const ageUnit = createMockUnit({ traits: ["age system"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AsemuAsuno088],
        play: [gd03GBouncer023, ageUnit, gd03GundamAge2Normal019],
        resourceArea: activeResources(5),
      },
      { play: [gd03Messala003] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [, ageUnitId, age2Id] = p1.getCardsInZone("battleArea");
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03AsemuAsuno088, age2Id!));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([ageUnitId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [ageUnitId!] }));

    expect(p1.getVisibleCard(ageUnitId!)?.keywords).toContain("HighManeuver");
    expectSuccess(p1.enterBattle(ageUnitId!, "direct"));
    expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
  });

  it("does not offer a non-AGE System Unit as the EX Resource trigger target", () => {
    const ordinaryUnit = createMockUnit({ traits: ["earth federation"] });
    const engine = GundamTestEngine.create({
      hand: [gd03AsemuAsuno088],
      play: [gd03GBouncer023, ordinaryUnit, gd03GundamAge2Normal019],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [, ordinaryId, age2Id] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd03AsemuAsuno088, age2Id!));

    const choice = p1.getBoardView().pendingChoice;
    expect(choice).toMatchObject({ kind: "targetSelection" });
    if (choice?.kind !== "targetSelection") throw new Error("Expected target selection");
    expect(choice.legalTargetIds).not.toContain(ordinaryId);
  });

  it("does not trigger when the opponent places an EX Resource", () => {
    const placeExResource = createMockCommand({
      level: 0,
      cost: 0,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [{ action: { action: "placeExResource", state: "active" } }],
          sourceText: "【Main】Place 1 EX Resource.",
        },
      ],
    });
    const ageUnit = createMockUnit({ traits: ["age system"] });
    const engine = GundamTestEngine.create(
      { play: [gd03GBouncer023, ageUnit] },
      { hand: [placeExResource], resourceArea: activeResources(1) },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const ageUnitId = p1.getCardsInZone("battleArea")[1]!;

    expectSuccess(p2.playCommand(placeExResource));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getVisibleCard(ageUnitId)?.keywords).not.toContain("HighManeuver");
  });

  it("removes High-Maneuver after the turn ends", () => {
    const ageUnit = createMockUnit({ traits: ["age system"] });
    const engine = GundamTestEngine.create({
      hand: [gd03AsemuAsuno088],
      play: [gd03GBouncer023, ageUnit, gd03GundamAge2Normal019],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [, ageUnitId, age2Id] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd03AsemuAsuno088, age2Id!));
    expectSuccess(p1.resolveEffect({ targets: [ageUnitId!] }));
    expect(p1.getVisibleCard(ageUnitId!)?.keywords).toContain("HighManeuver");

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getVisibleCard(ageUnitId!)?.keywords).not.toContain("HighManeuver");
  });
});
