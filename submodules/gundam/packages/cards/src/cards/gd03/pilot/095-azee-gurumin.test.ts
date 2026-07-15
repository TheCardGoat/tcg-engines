import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03ImprovedTechnique109 } from "../command/109-improved-technique.ts";
import { gd03AzeeGurumin095 } from "./095-azee-gurumin.ts";

describe("Azee Gurumin (GD03-095)", () => {
  it("【Burst】 adds this revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03AzeeGurumin095] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03AzeeGurumin095)).toBe(`hand:${PLAYER_TWO}`);
  });

  function passToPlayerTwoMain(
    p1: ReturnType<GundamTestEngine["asPlayer"]>,
    p2: ReturnType<GundamTestEngine["asPlayer"]>,
  ) {
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
  }

  it("gives an enemy Unit AP-1 when the paired Unit receives enemy effect damage", () => {
    const host = createMockUnit({ name: "Azee Host", level: 4, ap: 2, hp: 8 });
    const enemy = createMockUnit({ name: "Enemy Target", ap: 4, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AzeeGurumin095],
        play: [host],
        resourceArea: activeResources(4),
        deck: 5,
      },
      {
        hand: [gd03ImprovedTechnique109],
        play: [enemy],
        resourceArea: activeResources(3),
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03AzeeGurumin095, hostId));
    passToPlayerTwoMain(p1, p2);
    expectSuccess(p2.playCommand(gd03ImprovedTechnique109, { targets: [hostId] }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p1.getDamage(hostId)).toBe(3);
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);
  });

  it("does not trigger when a different friendly Unit receives enemy effect damage", () => {
    const host = createMockUnit({ name: "Azee Host", level: 4, ap: 2, hp: 8 });
    const otherFriendly = createMockUnit({ name: "Other Friendly", level: 4, ap: 2, hp: 8 });
    const enemy = createMockUnit({ name: "Enemy Target", ap: 4, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AzeeGurumin095],
        play: [host, otherFriendly],
        resourceArea: activeResources(4),
        deck: 5,
      },
      {
        hand: [gd03ImprovedTechnique109],
        play: [enemy],
        resourceArea: activeResources(3),
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, otherFriendlyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03AzeeGurumin095, hostId!));
    passToPlayerTwoMain(p1, p2);
    expectSuccess(p2.playCommand(gd03ImprovedTechnique109, { targets: [otherFriendlyId!] }));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);
  });

  it("offers the AP reduction at most once per turn", () => {
    const host = createMockUnit({ name: "Azee Host", level: 4, ap: 2, hp: 8 });
    const firstEnemy = createMockUnit({ name: "First Target", ap: 4, hp: 6 });
    const secondEnemy = createMockUnit({ name: "Second Target", ap: 4, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AzeeGurumin095],
        play: [host],
        resourceArea: activeResources(4),
        deck: 5,
      },
      {
        hand: [gd03ImprovedTechnique109, gd03ImprovedTechnique109],
        play: [firstEnemy, secondEnemy],
        resourceArea: activeResources(6),
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");
    const [firstCommandId, secondCommandId] = p2.getHand();

    expectSuccess(p1.assignPilot(gd03AzeeGurumin095, hostId));
    passToPlayerTwoMain(p1, p2);
    expectSuccess(p2.playCommand(firstCommandId!, { targets: [hostId] }));
    expectSuccess(p1.resolveEffect({ targets: [firstEnemyId!] }));
    expectSuccess(p2.playCommand(secondCommandId!, { targets: [hostId] }));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getVisibleCard(firstEnemyId!)?.effectiveAp).toBe(3);
    expect(p2.getVisibleCard(secondEnemyId!)?.effectiveAp).toBe(4);
  });
});
