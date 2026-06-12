import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockResource,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st07GundamExia001 } from "./001-gundam-exia.ts";

describe("Gundam Exia (ST07-001)", () => {
  it("data keeps the printed When Paired mill/draw text visible", () => {
    const whenPaired = st07GundamExia001.effects?.find((effect) =>
      effect.activation.timing?.includes("whenPaired"),
    );

    expect(whenPaired?.sourceText).toContain("Place the top 2 cards of your deck");
    expect(whenPaired?.sourceText).toContain("draw 1");
  });

  it("【When Paired】mills 2 and draws 1 if a milled card is CB", () => {
    const setsuna = createMockPilot({ name: "Setsuna F. Seiei", level: 1, cost: 1 });
    const cbCard = createMockUnit({ traits: ["cb"] });
    const nonCbCard = createMockUnit({ traits: ["zeon"] });
    const drawCard = createMockUnit({ traits: ["test"] });
    const engine = GundamTestEngine.create({
      hand: [setsuna],
      play: [st07GundamExia001],
      resourceArea: activeResources(5),
      deck: [cbCard, nonCbCard, drawCard],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const exiaId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(setsuna, exiaId));

    expect(engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE })).toBe(2);
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(0);
    expect(p1.getHand()).toHaveLength(1);
  });

  it("【When Paired】mills 2 without drawing when no milled card is CB", () => {
    const setsuna = createMockPilot({ name: "Setsuna F. Seiei", level: 1, cost: 1 });
    const nonCbA = createMockUnit({ traits: ["zeon"] });
    const nonCbB = createMockUnit({ traits: ["earth federation"] });
    const drawCard = createMockUnit({ traits: ["test"] });
    const engine = GundamTestEngine.create({
      hand: [setsuna],
      play: [st07GundamExia001],
      resourceArea: activeResources(5),
      deck: [nonCbA, nonCbB, drawCard],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const exiaId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(setsuna, exiaId));

    expect(engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE })).toBe(2);
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(1);
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

    engine.endTurn();

    expect(engine.getG().exhausted[resourceId] ?? false).toBe(false);
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

    engine.endTurn();

    expect(engine.getG().exhausted[resourceId]).toBe(true);
  });
});
