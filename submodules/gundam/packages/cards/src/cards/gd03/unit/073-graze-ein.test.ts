import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GrazeEin073 } from "./073-graze-ein.ts";

describe("Graze Ein (GD03-073)", () => {
  it("cannot use its Activate·Action ability during the Main Phase", () => {
    const ein = createMockPilot({ name: "Ein Dalton" });
    const enemy = createMockUnit({ ap: 5, hp: 10 });
    const trash = Array.from({ length: 6 }, () => createMockUnit({ traits: ["gjallarhorn"] }));
    const engine = GundamTestEngine.create(
      {
        hand: [ein],
        play: [gd03GrazeEin073],
        trash,
        resourceArea: activeResources(7),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(ein, unitId));

    expectFailure(p1.activateAbility(unitId, 0, { targets: [enemyId] }), "WRONG_PHASE");
  });

  it("blocks, reduces its battling enemy's AP by 3 once per turn, and expires after battle", () => {
    const ein = createMockPilot({ name: "Ein Dalton" });
    const enemy = createMockUnit({ ap: 5, hp: 10 });
    const trash = Array.from({ length: 6 }, () => createMockUnit({ traits: ["gjallarhorn"] }));
    const engine = GundamTestEngine.create(
      {
        hand: [ein],
        play: [gd03GrazeEin073],
        trash,
        resourceArea: activeResources(7),
        deck: 5,
      },
      { play: [enemy], shieldArea: [createMockUnit({ name: "Shield" })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(ein, unitId));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.declareBlock(unitId));

    expectSuccess(p1.activateAbility(unitId, 0, { targets: [enemyId] }));
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);

    expectSuccess(p2.passBattleAction());
    expectFailure(p1.activateAbility(unitId, 0, { targets: [enemyId] }), "ABILITY_LIMIT_REACHED");
    expectSuccess(p1.passBattleAction());

    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
  });

  it("cannot use the AP reduction while paired but not linked", () => {
    const wrongPilot = createMockPilot({ name: "Gaelio Bauduin" });
    const enemy = createMockUnit({ ap: 5, hp: 10 });
    const trash = Array.from({ length: 6 }, () => createMockUnit({ traits: ["gjallarhorn"] }));
    const engine = GundamTestEngine.create(
      {
        hand: [wrongPilot],
        play: [gd03GrazeEin073],
        trash,
        resourceArea: activeResources(7),
        deck: 3,
      },
      { play: [enemy], deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(wrongPilot, unitId));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.declareBlock(unitId));

    expectFailure(p1.activateAbility(unitId, 0, { targets: [enemyId] }));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
  });

  it("cannot use the AP reduction with fewer than 6 Gjallarhorn cards in trash", () => {
    const ein = createMockPilot({ name: "Ein Dalton" });
    const enemy = createMockUnit({ ap: 5, hp: 10 });
    const trash = Array.from({ length: 5 }, () => createMockUnit({ traits: ["gjallarhorn"] }));
    const engine = GundamTestEngine.create(
      {
        hand: [ein],
        play: [gd03GrazeEin073],
        trash,
        resourceArea: activeResources(7),
        deck: 3,
      },
      { play: [enemy], deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(ein, unitId));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.declareBlock(unitId));

    expectFailure(p1.activateAbility(unitId, 0, { targets: [enemyId] }));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
  });
});
