import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02WhiteGundam032 } from "./032-white-gundam.ts";
import { gd02QuattroBajeena098 } from "../pilot/098-quattro-bajeena.ts";

describe("White Gundam (GD02-032)", () => {
  it("deploys from hand and rests 2 Resources", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02WhiteGundam032],
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
      hand: [gd02WhiteGundam032],
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
      hand: [spender, gd02WhiteGundam032],
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

  it("can attack on its deployment turn after pairing Char Aznable", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd02WhiteGundam032, gd02QuattroBajeena098],
        resourceArea: activeResources(5),
      },
      { shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02WhiteGundam032));
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(gd02QuattroBajeena098, unitId));

    expectSuccess(p1.enterBattle(unitId, "direct"));
  });
});
