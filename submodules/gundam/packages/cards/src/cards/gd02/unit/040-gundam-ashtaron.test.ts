import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd02GundamAshtaron040 } from "./040-gundam-ashtaron.ts";
import { gd02OlbaFrost093 } from "../pilot/093-olba-frost.ts";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Gundam Ashtaron (GD02-040)", () => {
  describe("Printed Lv.4 and cost 3", () => {
    it("cannot deploy with only 3 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamAshtaron040],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 2 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GundamAshtaron040],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(2);
    });
  });

  it("Support 2 rests Ashtaron and gives another friendly Unit AP+2", () => {
    const ally = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create({ play: [gd02GundamAshtaron040, ally] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [ashtaronId, allyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.useSupport(ashtaronId!, allyId!));

    expect(p1.isExhausted(ashtaronId!)).toBe(true);
    expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(4);
  });

  it("Support cannot choose Ashtaron itself", () => {
    const engine = GundamTestEngine.create({ play: [gd02GundamAshtaron040] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const ashtaronId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.useSupport(ashtaronId, ashtaronId), "ILLEGAL_TARGET");

    expect(p1.isExhausted(ashtaronId)).toBe(false);
  });

  it("prevents battle damage from an enemy Unit with 2 HP during the turn", () => {
    const protectedUnit = createMockUnit({ ap: 0, hp: 5, traits: ["new une"] });
    const lowHpEnemy = createMockUnit({ ap: 2, hp: 2 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamAshtaron040],
        play: [protectedUnit],
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [lowHpEnemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const protectedId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.deployUnit(gd02GundamAshtaron040));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [protectedId],
    });
    expectSuccess(p1.resolveEffect({ targets: [protectedId] }));
    resolveUnitBattle(engine, PLAYER_ONE, protectedId, enemyId);

    expect(p1.getDamage(protectedId)).toBe(0);
  });

  it("does not prevent battle damage from an enemy Unit with more than 2 HP", () => {
    const protectedUnit = createMockUnit({ ap: 0, hp: 5, traits: ["new une"] });
    const highHpEnemy = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamAshtaron040],
        play: [protectedUnit],
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [highHpEnemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const protectedId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.deployUnit(gd02GundamAshtaron040));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [protectedId],
    });
    expectSuccess(p1.resolveEffect({ targets: [protectedId] }));
    resolveUnitBattle(engine, PLAYER_ONE, protectedId, enemyId);

    expect(p1.getDamage(protectedId)).toBe(2);
  });

  it("does not prevent effect damage", () => {
    const protectedUnit = createMockUnit({ ap: 0, hp: 5, traits: ["new une"] });
    const enemyEffectSource = createMockUnit({
      name: "Low-HP Enemy Effect Source",
      hp: 2,
      effects: [
        {
          type: "activated",
          activation: { timing: ["activate:action"] },
          directives: [
            {
              action: {
                action: "dealDamage",
                amount: 2,
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Activate･Action】Choose 1 enemy Unit. Deal 2 damage to it.",
        },
      ],
    });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamAshtaron040],
        play: [protectedUnit],
        resourceArea: activeResources(4),
      },
      { play: [enemyEffectSource] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const protectedId = p1.getCardsInZone("battleArea")[0]!;
    const sourceId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd02GundamAshtaron040));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [protectedId],
    });
    expectSuccess(p1.resolveEffect({ targets: [protectedId] }));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.activateAbility(sourceId, 0));
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([protectedId]),
    });
    expectSuccess(p2.resolveEffect({ targets: [protectedId] }));

    expect(p1.getDamage(protectedId)).toBe(2);
  });

  it("stops preventing battle damage after the turn ends", () => {
    const protectedUnit = createMockUnit({ ap: 0, hp: 5, traits: ["new une"] });
    const lowHpEnemy = createMockUnit({ ap: 2, hp: 2 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamAshtaron040],
        play: [protectedUnit],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [lowHpEnemy], shieldArea: [createMockUnit()], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const protectedId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd02GundamAshtaron040));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [protectedId],
    });
    expectSuccess(p1.resolveEffect({ targets: [protectedId] }));
    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [protectedId]);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    resolveUnitBattle(engine, PLAYER_TWO, enemyId, protectedId);

    expect(p1.getDamage(protectedId)).toBe(2);
  });

  it("can attack on its deployment turn after pairing a New UNE Pilot", () => {
    const ally = createMockUnit({ traits: ["new une"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamAshtaron040, gd02OlbaFrost093],
        play: [ally],
        resourceArea: activeResources(4),
      },
      { shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const allyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd02GundamAshtaron040));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [allyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [allyId] }));
    const ashtaronId = p1.getCardsInZone("battleArea")[1]!;
    expectSuccess(p1.assignPilot(gd02OlbaFrost093, ashtaronId));

    expectSuccess(p1.enterBattle(ashtaronId, "direct"));
  });
});
