import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01CharSGelgoog023 } from "./023-char-s-gelgoog.ts";

describe("Char's Gelgoog (GD01-023)", () => {
  it("asks which Zeon or Neo Zeon Unit pays the cost, then which valid Newtype Pilot to pair", () => {
    const zeonCost = createMockUnit({ name: "Zeon Cost", traits: ["zeon"] });
    const neoZeonCost = createMockUnit({ name: "Neo Zeon Cost", traits: ["neo zeon"] });
    const wrongCost = createMockUnit({ name: "Wrong Cost", traits: ["earth federation"] });
    const validPilot = createMockPilot({ name: "Valid Newtype", traits: ["newtype"], level: 3 });
    const wrongTrait = createMockPilot({ name: "Wrong Trait", traits: ["civilian"], level: 2 });
    const tooHigh = createMockPilot({ name: "Too High", traits: ["newtype"], level: 4 });
    const engine = GundamTestEngine.create({
      play: [gd01CharSGelgoog023],
      hand: [zeonCost, neoZeonCost, wrongCost],
      trash: [validPilot, wrongTrait, tooHigh],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [zeonCostId, neoZeonCostId, wrongCostId] = p1.getHand();
    const [validPilotId] = p1.getCardsInZone("trash");

    expect(p1.getMoveProcedure("activateAbility", { cardId: unitId, effectIndex: 0 })).toEqual([
      expect.objectContaining({
        kind: "selectTarget",
        role: "cost",
        candidateIds: [zeonCostId, neoZeonCostId],
        minTargets: 1,
        maxTargets: 1,
      }),
    ]);
    expectSuccess(p1.activateAbility(unitId, 0, { targets: [neoZeonCostId!] }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [validPilotId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [validPilotId!] }));

    expect(p1.getCardZone(zeonCostId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(neoZeonCostId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(wrongCostId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(unitId)).toBe(validPilotId);
    expect(p1.getCardZone(validPilotId!)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("rejects activation when no Zeon or Neo Zeon Unit can pay the discard cost", () => {
    const wrongCost = createMockUnit({ traits: ["earth federation"] });
    const pilot = createMockPilot({ traits: ["newtype"], level: 2 });
    const engine = GundamTestEngine.create({
      play: [gd01CharSGelgoog023],
      hand: [wrongCost],
      trash: [pilot],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const wrongCostId = p1.getHand()[0]!;

    expectFailure(p1.activateAbility(unitId, 0, { targets: [wrongCostId] }), "COST_NOT_PAYABLE");

    expect(p1.getCardZone(wrongCostId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("does not offer activation when the cost is payable but no legal Newtype Pilot is in trash", () => {
    const zeonCost = createMockUnit({ traits: ["zeon"] });
    const wrongTrait = createMockPilot({ traits: ["civilian"], level: 2 });
    const tooHigh = createMockPilot({ traits: ["newtype"], level: 4 });
    const engine = GundamTestEngine.create({
      play: [gd01CharSGelgoog023],
      hand: [zeonCost],
      trash: [wrongTrait, tooHigh],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const costId = p1.getHand()[0]!;

    expect(p1.getMoveProcedure("activateAbility", { cardId: unitId, effectIndex: 0 })).toEqual([]);
    expectFailure(p1.activateAbility(unitId, 0, { targets: [costId] }), "NO_LEGAL_TARGETS");

    expect(p1.getCardZone(costId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("rejects activation after a Pilot has already been paired through the public move", () => {
    const existingPilot = createMockPilot({ level: 1, cost: 1 });
    const cost = createMockUnit({ traits: ["zeon"] });
    const candidate = createMockPilot({ traits: ["newtype"], level: 2 });
    const engine = GundamTestEngine.create({
      play: [gd01CharSGelgoog023],
      hand: [existingPilot, cost],
      trash: [candidate],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const costId = p1.getHand()[1]!;

    expectSuccess(p1.assignPilot(existingPilot, unitId));
    expectFailure(p1.activateAbility(unitId, 0, { targets: [costId] }), "CONDITIONS_NOT_MET");

    expect(p1.getCardZone(costId)).toBe(`hand:${PLAYER_ONE}`);
  });
});
