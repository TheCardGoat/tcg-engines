import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01NavalBombardment120 } from "./120-naval-bombardment.ts";

describe("Naval Bombardment (GD01-120)", () => {
  it("【Burst】 asks for one enemy Unit and gives the chosen Unit AP-3", () => {
    const attacker = createMockUnit({ ap: 5, hp: 5 });
    const otherEnemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd01NavalBombardment120] },
      { play: [attacker, otherEnemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [attackerId, otherEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.enterBattle(attackerId!, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([attackerId, otherEnemyId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [otherEnemyId!] }));

    expect(p2.getVisibleCard(attackerId!)?.effectiveAp).toBe(5);
    expect(p2.getVisibleCard(otherEnemyId!)?.effectiveAp).toBe(1);
  });

  it("【Action】 gives a chosen friendly Blocker AP+3", () => {
    const blocker = createMockUnit({ ap: 2, keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create({
      hand: [gd01NavalBombardment120],
      play: [blocker],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const blockerId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Naval Bombardment to ask which friendly Blocker gains AP");
    }
    expect(choice.legalTargetIds).toEqual([blockerId]);
    expectSuccess(p1.resolveEffect({ targets: [blockerId] }));

    expect(p1.getVisibleCard(blockerId)?.effectiveAp).toBe(5);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("rejects a friendly non-Blocker and an enemy Blocker", () => {
    const friendly = createMockUnit({ keywordEffects: [] });
    const enemy = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01NavalBombardment120],
        play: [friendly],
        resourceArea: activeResources(2),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectFailure(
      p1.playCommand(gd01NavalBombardment120, { targets: [friendlyId] }),
      "INVALID_TARGET",
    );
    expectFailure(
      p1.playCommand(gd01NavalBombardment120, { targets: [enemyId] }),
      "INVALID_TARGET",
    );
  });

  it("cannot use its Action effect during Main", () => {
    const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create({
      hand: [gd01NavalBombardment120],
      play: [blocker],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const blockerId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd01NavalBombardment120, { targets: [blockerId] }),
      "WRONG_TIMING",
    );
  });

  it("cannot be played below its printed Lv.2 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01NavalBombardment120],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01NavalBombardment120), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01NavalBombardment120)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves no active Resources", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 2,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [],
          sourceText: "【Main】Do nothing.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [setup, gd01NavalBombardment120],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
