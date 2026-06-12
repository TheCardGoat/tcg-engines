import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd03GundamBarbatosLupus050 } from "./050-gundam-barbatos-lupus.ts";

describe("Gundam Barbatos Lupus (GD03-050)", () => {
  it("【Activate･Main】 exiles 3 Tekkadan/Teiwaz Unit cards from trash", () => {
    const trashA = createMockUnit({ traits: ["tekkadan"] });
    const trashB = createMockUnit({ traits: ["teiwaz"] });
    const trashC = createMockUnit({ traits: ["tekkadan"] });
    const engine = GundamTestEngine.create({
      play: [gd03GundamBarbatosLupus050],
      trash: [trashA, trashB, trashC],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const trashIds = p1.getCardsInZone("trash");

    expectSuccess(p1.activateAbility(unitId, 0, { targets: trashIds }));

    expect(p1.getCardsInZone("trash")).toHaveLength(0);
  });

  it("after exiling 3 Tekkadan/Teiwaz Unit cards from trash, deals 2 damage to an enemy Unit", () => {
    const trashA = createMockUnit({ traits: ["tekkadan"] });
    const trashB = createMockUnit({ traits: ["teiwaz"] });
    const trashC = createMockUnit({ traits: ["tekkadan"] });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        play: [gd03GundamBarbatosLupus050],
        trash: [trashA, trashB, trashC],
        resourceArea: activeResources(7),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const trashIds = p1.getCardsInZone("trash");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.activateAbility(unitId, 0, { targets: [...trashIds, enemyId] }));

    expect(p1.getCardsInZone("trash")).toHaveLength(0);
    expect(getDamageCounter(engine, enemyId)).toBe(2);
  });
});
