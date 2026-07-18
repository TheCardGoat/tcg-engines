import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd02GundamAshtaronMaMode042 } from "./042-gundam-ashtaron-ma-mode.ts";
import { gd02OlbaFrost093 } from "../pilot/093-olba-frost.ts";

describe("Gundam Ashtaron (MA Mode) (GD02-042)", () => {
  describe("Printed Lv.3 and cost 2", () => {
    it("cannot deploy with only 2 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamAshtaronMaMode042],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 1 active Resource", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GundamAshtaronMaMode042],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(1);
    });
  });

  it("grants High-Maneuver to a friendly New UNE Unit and prevents blocking", () => {
    const newUneUnit = createMockUnit({ traits: ["new une"], hp: 5 });
    const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }], hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamAshtaronMaMode042],
        play: [newUneUnit],
        resourceArea: activeResources(3),
      },
      { play: [blocker], shieldArea: [createMockUnit({ name: "Shield" })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const newUneId = p1.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd02GundamAshtaronMaMode042));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([newUneId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [newUneId] }));
    expect(p1.getVisibleCard(newUneId)?.keywords).toContain("HighManeuver");
    expectSuccess(p1.enterBattle(newUneId, "direct"));

    expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
  });

  it("does not offer a friendly Unit without the New UNE trait", () => {
    const nonUne = createMockUnit({ traits: ["earth federation"] });
    const engine = GundamTestEngine.create({
      hand: [gd02GundamAshtaronMaMode042],
      play: [nonUne],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const nonUneId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd02GundamAshtaronMaMode042));
    const sourceId = p1.getCardsInZone("battleArea")[1]!;
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [sourceId],
    });
    expectSuccess(p1.resolveEffect({ targets: [sourceId] }));

    expect(p1.getVisibleCard(nonUneId)?.keywords).not.toContain("HighManeuver");
    expect(p1.getVisibleCard(sourceId)?.keywords).toContain("HighManeuver");
  });

  it("removes High-Maneuver when the turn ends", () => {
    const newUneUnit = createMockUnit({ traits: ["new une"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamAshtaronMaMode042],
        play: [newUneUnit],
        resourceArea: activeResources(3),
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const newUneId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd02GundamAshtaronMaMode042));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([newUneId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [newUneId] }));
    expect(p1.getVisibleCard(newUneId)?.keywords).toContain("HighManeuver");

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getVisibleCard(newUneId)?.keywords).not.toContain("HighManeuver");
  });

  it("can attack on its deployment turn after pairing Olba Frost", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamAshtaronMaMode042, gd02OlbaFrost093],
        resourceArea: activeResources(3),
      },
      { shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02GundamAshtaronMaMode042));
    const ashtaronId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [ashtaronId],
    });
    expectSuccess(p1.resolveEffect({ targets: [ashtaronId] }));
    expectSuccess(p1.assignPilot(gd02OlbaFrost093, ashtaronId));

    expectSuccess(p1.enterBattle(ashtaronId, "direct"));
  });
});
