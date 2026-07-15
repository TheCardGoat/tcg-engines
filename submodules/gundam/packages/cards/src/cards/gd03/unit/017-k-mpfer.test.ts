import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03BernardWiseman089 } from "../pilot/089-bernard-wiseman.ts";
import { gd03MikhailKaminsky090 } from "../pilot/090-mikhail-kaminsky.ts";
import { gd03KMpfer017 } from "./017-k-mpfer.ts";

describe("Kämpfer (GD03-017)", () => {
  it("behavior: Burst adds a Cyclops Team Pilot card from trash to hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03KMpfer017], trash: [gd03BernardWiseman089] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const pilotId = p2.getCardsInZone("trash")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [pilotId],
    });
    expectSuccess(p2.resolveEffect({ targets: [pilotId] }));

    expect(p2.getCardZone(pilotId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("may decline its Burst and leave the Cyclops Team Pilot in trash", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03KMpfer017], trash: [gd03BernardWiseman089] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const pilotId = p2.getCardsInZone("trash")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional" });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: false } }));

    expect(p2.getCardZone(gd03KMpfer017)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(pilotId)).toBe(`trash:${PLAYER_TWO}`);
  });

  describe("【When Paired･(Cyclops Team) Pilot】All your (Cyclops Team) Units may choose an active enemy Unit with 5 or less AP as their attack target during this turn.", () => {
    it("grants the attack option to Kämpfer and another friendly Cyclops Team Unit", () => {
      const ally = createMockUnit({ traits: ["cyclops team"] });
      const enemy = createMockUnit({ ap: 5, hp: 4 });
      const tooPowerfulEnemy = createMockUnit({ ap: 6, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03MikhailKaminsky090],
          play: [gd03KMpfer017, ally],
          resourceArea: activeResources(4),
        },
        { play: [enemy, tooPowerfulEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [kampferId, allyId] = p1.getCardsInZone("battleArea");
      const [enemyId, tooPowerfulEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd03MikhailKaminsky090, kampferId!));

      for (const targetId of [kampferId!, allyId!]) {
        expect(p1.getLegalAttackTargets(targetId)).toContain(enemyId);
        expect(p1.getLegalAttackTargets(targetId)).not.toContain(tooPowerfulEnemyId);
      }
    });

    it("does not grant the attack option to friendly non-Cyclops Team Units", () => {
      const nonCyclopsAlly = createMockUnit({ traits: ["zeon"] });
      const enemy = createMockUnit({ ap: 5, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03MikhailKaminsky090],
          play: [gd03KMpfer017, nonCyclopsAlly],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [kampferId, nonCyclopsId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03MikhailKaminsky090, kampferId!));

      expect(p1.getLegalAttackTargets(kampferId!)).toContain(enemyId);
      expect(p1.getLegalAttackTargets(nonCyclopsId!)).not.toContain(enemyId);
    });

    it("does not trigger when paired with a non-Cyclops Team Pilot", () => {
      const ordinaryPilot = createMockPilot({ traits: ["zeon"], cost: 1 });
      const ally = createMockUnit({ traits: ["cyclops team"] });
      const enemy = createMockUnit({ ap: 5, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [ordinaryPilot],
          play: [gd03KMpfer017, ally],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [kampferId, allyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(ordinaryPilot, kampferId!));

      expect(p1.getLegalAttackTargets(kampferId!)).not.toContain(enemyId);
      expect(p1.getLegalAttackTargets(allyId!)).not.toContain(enemyId);
    });

    it("removes the active-enemy attack option after the turn ends", () => {
      const ally = createMockUnit({ traits: ["cyclops team"] });
      const activeEnemy = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03MikhailKaminsky090],
          play: [gd03KMpfer017, ally],
          resourceArea: activeResources(4),
          deck: 5,
        },
        { play: [activeEnemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [kampferId, allyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03MikhailKaminsky090, kampferId!));
      expect(p1.getLegalAttackTargets(kampferId!)).toContain(enemyId);
      expect(p1.getLegalAttackTargets(allyId!)).toContain(enemyId);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passPhase());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passActionStep());

      expect(p1.getLegalAttackTargets(kampferId!)).not.toContain(enemyId);
      expect(p1.getLegalAttackTargets(allyId!)).not.toContain(enemyId);
    });
  });
});
