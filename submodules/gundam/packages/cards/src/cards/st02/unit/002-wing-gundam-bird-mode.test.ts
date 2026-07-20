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
import { st02WingGundamBirdMode002 } from "./002-wing-gundam-bird-mode.ts";

describe("Wing Gundam (Bird Mode) (ST02-002)", () => {
  describe("【Deploy】Place 1 EX Resource.", () => {
    it("keeps the deployed Unit in battle and places one separate active EX Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [st02WingGundamBirdMode002],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const birdModeId = p1.getHand()[0]!;
      const resourcesBefore = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.deployUnit(birdModeId));

      const resources = p1.getCardsInZone("resourceArea");
      const exResourceId = resources.find((id) => !resourcesBefore.includes(id));
      expect(exResourceId).toBeDefined();
      expect(resources).toHaveLength(resourcesBefore.length + 1);
      expect(p1.isExhausted(exResourceId!)).toBe(false);
      expect(p1.getCardZone(birdModeId)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("places the EX Resource only for Bird Mode's own Deploy event", () => {
      const unrelated = createMockUnit({ level: 0, cost: 0 });
      const engine = GundamTestEngine.create({
        hand: [unrelated, st02WingGundamBirdMode002],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unrelatedId, birdModeId] = p1.getHand();

      expectSuccess(p1.deployUnit(unrelatedId!));
      expect(p1.getResourceCount()).toBe(3);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();

      expectSuccess(p1.deployUnit(birdModeId!));
      expect(p1.getResourceCount()).toBe(4);
    });

    it("places the EX Resource for its controller without changing the opponent's Resources", () => {
      const engine = GundamTestEngine.create(
        { hand: [st02WingGundamBirdMode002], resourceArea: activeResources(3) },
        { resourceArea: activeResources(2) },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.deployUnit(st02WingGundamBirdMode002));

      expect(p1.getResourceCount()).toBe(4);
      expect(p2.getResourceCount()).toBe(2);
    });

    it("can immediately spend the active EX Resource on a later play", () => {
      const followUp = createMockUnit({ level: 0, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [st02WingGundamBirdMode002, followUp],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [birdModeId, followUpId] = p1.getHand();

      expectSuccess(p1.deployUnit(birdModeId!));
      expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(1);
      expectSuccess(p1.deployUnit(followUpId!));

      expect(p1.getCardZone(followUpId!)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getResourceCount()).toBe(3);
    });
  });

  it("cannot be deployed below its printed Lv.3 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [st02WingGundamBirdMode002],
      resourceArea: activeResources(2),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st02WingGundamBirdMode002),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("cannot pay its printed deployment cost with only two active Resources", () => {
    const engine = GundamTestEngine.create({
      hand: [st02WingGundamBirdMode002],
      resourceArea: [
        ...activeResources(2),
        ...activeResources(1).map((entry) => ({ ...entry, exhausted: true })),
      ],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(st02WingGundamBirdMode002), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(st02WingGundamBirdMode002)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot be deployed in a legally reached Action step", () => {
    const engine = GundamTestEngine.create(
      { hand: [st02WingGundamBirdMode002], resourceArea: activeResources(3) },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectFailure(p1.deployUnit(st02WingGundamBirdMode002), "WRONG_PHASE");
    expect(p1.getResourceCount()).toBe(3);
  });
});
