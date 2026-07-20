import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockResource,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st07GundamExia001 } from "./001-gundam-exia.ts";

describe("Gundam Exia (ST07-001)", () => {
  it("cannot deploy below its printed Lv.5 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [st07GundamExia001],
      resourceArea: activeResources(4),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st07GundamExia001),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("deploys for four active Resources at Lv.5", () => {
    const engine = GundamTestEngine.create({
      hand: [st07GundamExia001],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cardId = p1.getHand()[0]!;
    expectSuccess(p1.deployUnit(cardId));
    expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(4);
  });

  it("【When Paired】mills 2 and draws 1 if a milled card is CB", () => {
    const setsuna = createMockPilot({ name: "Setsuna F. Seiei", level: 1, cost: 1 });
    const cbCard = createMockUnit({ traits: ["cb"] });
    const nonCbCard = createMockUnit({ traits: ["zeon"] });
    const drawCard = createMockUnit({ traits: ["test"] });
    const bottomSentinel = createMockUnit({ traits: ["test"] });
    const engine = GundamTestEngine.create({
      hand: [setsuna],
      play: [st07GundamExia001],
      resourceArea: activeResources(5),
      deck: [bottomSentinel, drawCard, nonCbCard, cbCard],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const exiaId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(setsuna, exiaId));

    expect(p1.getCardsInZone("trash")).toHaveLength(2);
    expect(p1.getCardsInZone("deck")).toHaveLength(1);
    expect(p1.getHand()).toHaveLength(1);
  });

  it("【When Paired】mills 2 without drawing when no milled card is CB", () => {
    const setsuna = createMockPilot({ name: "Setsuna F. Seiei", level: 1, cost: 1 });
    const nonCbA = createMockUnit({ traits: ["zeon"] });
    const nonCbB = createMockUnit({ traits: ["earth federation"] });
    const drawCard = createMockUnit({ traits: ["test"] });
    const bottomSentinel = createMockUnit({ traits: ["test"] });
    const engine = GundamTestEngine.create({
      hand: [setsuna],
      play: [st07GundamExia001],
      resourceArea: activeResources(5),
      deck: [bottomSentinel, drawCard, nonCbA, nonCbB],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const exiaId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(setsuna, exiaId));

    expect(p1.getCardsInZone("trash")).toHaveLength(2);
    expect(p1.getCardsInZone("deck")).toHaveLength(2);
    expect(p1.getHand()).toHaveLength(0);
  });

  it("at end of your turn with 7 or more CB cards in trash, sets one Resource active", () => {
    const restedResource = createMockResource();
    const trash = Array.from({ length: 7 }, () => createMockUnit({ traits: ["cb"] }));
    const engine = GundamTestEngine.create({
      play: [st07GundamExia001],
      resourceArea: [{ card: restedResource, exhausted: true }],
      trash,
      deck: 5,
    });
    const resourceId = engine.asPlayer(PLAYER_ONE).getCardsInZone("resourceArea")[0]!;
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [resourceId],
    });
    expectSuccess(p1.resolveEffect({ targets: [resourceId] }));

    expect(p1.isExhausted(resourceId)).toBe(false);
  });

  it("does not set a Resource active at end of turn with fewer than 7 CB cards in trash", () => {
    const restedResource = createMockResource();
    const trash = Array.from({ length: 6 }, () => createMockUnit({ traits: ["cb"] }));
    const engine = GundamTestEngine.create({
      play: [st07GundamExia001],
      resourceArea: [{ card: restedResource, exhausted: true }],
      trash,
      deck: 5,
    });
    const resourceId = engine.asPlayer(PLAYER_ONE).getCardsInZone("resourceArea")[0]!;
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.isExhausted(resourceId)).toBe(true);
  });

  it("allows an already active Resource to be chosen at the seven-CB threshold", () => {
    const trash = Array.from({ length: 7 }, () => createMockUnit({ traits: ["cb"] }));
    const engine = GundamTestEngine.create({
      play: [st07GundamExia001],
      resourceArea: [createMockResource()],
      trash,
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const resourceId = p1.getCardsInZone("resourceArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expect(p1.getBoardView().pendingChoice).toMatchObject({ legalTargetIds: [resourceId] });
    expectSuccess(p1.resolveEffect({ targets: [resourceId] }));
    expect(p1.isExhausted(resourceId)).toBe(false);
  });

  describe("Link [Setsuna F. Seiei]", () => {
    it("can attack on its deploy turn after pairing with Setsuna", () => {
      const setsuna = createMockPilot({ name: "Setsuna F. Seiei", level: 1, cost: 0 });
      const engine = GundamTestEngine.create(
        { hand: [st07GundamExia001, setsuna], resourceArea: activeResources(5), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st07GundamExia001));
      const exiaId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(setsuna, exiaId));
      expectSuccess(p1.enterBattle(exiaId, "direct"));
    });

    it("cannot attack on its deploy turn after pairing with a different Pilot", () => {
      const pilot = createMockPilot({ name: "Wrong Pilot", level: 1, cost: 0 });
      const engine = GundamTestEngine.create(
        { hand: [st07GundamExia001, pilot], resourceArea: activeResources(5), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st07GundamExia001));
      const exiaId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, exiaId));
      expectFailure(p1.enterBattle(exiaId, "direct"), "CANNOT_ATTACK");
    });
  });
});
