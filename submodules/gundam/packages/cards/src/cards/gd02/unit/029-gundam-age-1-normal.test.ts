import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02GundamAge1Normal029 } from "./029-gundam-age-1-normal.ts";
import { gd02FlitAsuno088 } from "../pilot/088-flit-asuno.ts";

describe("Gundam AGE-1 Normal (GD02-029)", () => {
  it("deploys from hand and rests 2 Resources", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02GundamAge1Normal029],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cardId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(cardId));

    expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(cardId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("cannot deploy below its printed Lv.3 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02GundamAge1Normal029],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cardId = p1.getHand()[0]!;

    expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

    expect(p1.getHand()).toContain(cardId);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
  });

  it("cannot deploy after another legal play leaves only 1 active Resource", () => {
    const spender = createMockUnit({ level: 1, cost: 2 });
    const engine = GundamTestEngine.create({
      hand: [spender, gd02GundamAge1Normal029],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(spender));
    const cardId = p1.getHand()[0]!;

    expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

    expect(p1.getHand()).toContain(cardId);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
  });

  it("can attack on its deployment turn after pairing an Asuno Family Pilot", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamAge1Normal029, gd02FlitAsuno088],
        resourceArea: activeResources(4),
      },
      { shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02GundamAge1Normal029));
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(gd02FlitAsuno088, unitId));

    expectSuccess(p1.enterBattle(unitId, "direct"));
  });
});
