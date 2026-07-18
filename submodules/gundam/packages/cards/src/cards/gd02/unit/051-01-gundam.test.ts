import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  expectFailure,
  expectSuccess,
  createMockUnit,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd0201Gundam051 } from "./051-01-gundam.ts";

describe("01 Gundam (GD02-051)", () => {
  it("stays in hand below its printed Lv.2 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd0201Gundam051],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cardId = p1.getHand()[0]!;

    expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

    expect(p1.getHand()).toContain(cardId);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
  });

  it("deploys from hand and rests 2 Resources", () => {
    const engine = GundamTestEngine.create({
      hand: [gd0201Gundam051],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cardId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(cardId));

    expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("resourceArea").every((id) => p1.isExhausted(id))).toBe(true);
  });

  it("stays in hand without enough active Resources", () => {
    const resourceSpender = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd0201Gundam051],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cardId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(resourceSpender));
    expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

    expect(p1.getHand()).toContain(cardId);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
  });
});
