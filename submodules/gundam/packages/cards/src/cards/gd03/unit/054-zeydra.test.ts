import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Zeydra054 } from "./054-zeydra.ts";

describe("Zeydra (GD03-054)", () => {
  it("<High-Maneuver> prevents an enemy Blocker from intercepting its attack", () => {
    const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create({ play: [gd03Zeydra054] }, { play: [blocker] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const zeydraId = p1.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(zeydraId, "direct"));
    expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");

    expect(p2.isExhausted(blockerId)).toBe(false);
  });

  it("【When Paired･(X-Rounder) Pilot】 may exile 4 Vagan cards from trash to destroy an enemy Lv.4 or lower Unit", () => {
    const pilot = createMockPilot({ name: "Zeheart Galette", traits: ["x-rounder"] });
    const trashCards = Array.from({ length: 4 }, () => createMockUnit({ traits: ["vagan"] }));
    const enemy = createMockUnit({ level: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03Zeydra054],
        trash: trashCards,
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const trashIds = p1.getCardsInZone("trash");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "optional") throw new Error("Expected the Vagan exile choice");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: trashIds,
      minTargets: 4,
      maxTargets: 4,
    });
    expectSuccess(p1.resolveEffect({ targets: trashIds }));

    for (const trashId of trashIds) expect(p1.getCardZone(trashId)).toBe("removalArea");
    expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("skips the destroy when the optional exile is declined", () => {
    const pilot = createMockPilot({ name: "Zeheart Galette", traits: ["x-rounder"] });
    const trashCards = Array.from({ length: 4 }, () => createMockUnit({ traits: ["vagan"] }));
    const enemy = createMockUnit({ level: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03Zeydra054],
        trash: trashCards,
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "optional") throw new Error("Expected the Vagan exile choice");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: false } }));

    expect(p1.getCardsInZone("trash")).toHaveLength(4);
    expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("does not destroy an enemy Unit above Lv.4", () => {
    const pilot = createMockPilot({ name: "Zeheart Galette", traits: ["x-rounder"] });
    const trashCards = Array.from({ length: 4 }, () => createMockUnit({ traits: ["vagan"] }));
    const enemy = createMockUnit({ level: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03Zeydra054],
        trash: trashCards,
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));
    expect(p1.getBoardView().pendingChoice).toBeUndefined();

    expect(p1.getCardsInZone("trash")).toHaveLength(4);
    expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});
