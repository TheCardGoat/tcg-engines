import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GundamBarbatosLupus050 } from "./050-gundam-barbatos-lupus.ts";

describe("Gundam Barbatos Lupus (GD03-050)", () => {
  it("【Activate･Main】 exiles 3 Tekkadan/Teiwaz Units and then deals 2 damage", () => {
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
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.activateAbility(unitId, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: trashIds,
      minTargets: 3,
      maxTargets: 3,
    });
    expectSuccess(p1.resolveEffect({ targets: trashIds }));

    expect(p1.getCardsInZone("trash")).toHaveLength(0);
    for (const trashId of trashIds) expect(p1.getCardZone(trashId)).toBe("removalArea");
    expect(p2.getDamage(enemyId)).toBe(0);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    expect(p2.getDamage(enemyId)).toBe(2);
  });

  it("rejects a trash card without the Tekkadan or Teiwaz trait", () => {
    const eligibleA = createMockUnit({ traits: ["tekkadan"] });
    const eligibleB = createMockUnit({ traits: ["teiwaz"] });
    const eligibleC = createMockUnit({ traits: ["tekkadan"] });
    const wrongTrait = createMockUnit({ traits: ["cb"] });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        play: [gd03GundamBarbatosLupus050],
        trash: [eligibleA, eligibleB, eligibleC, wrongTrait],
        resourceArea: activeResources(7),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const trashIds = p1.getCardsInZone("trash");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.activateAbility(unitId, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: trashIds.slice(0, 3),
    });
    expectFailure(
      p1.resolveEffect({ targets: [trashIds[0]!, trashIds[1]!, trashIds[3]!] }),
      "ILLEGAL_TARGET",
    );

    expect(p1.getCardsInZone("trash")).toEqual(trashIds);
    expect(p2.getDamage(enemyId)).toBe(0);
  });
});
