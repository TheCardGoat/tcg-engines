import { describe, it, expect } from "vite-plus/test";
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
import { gd04Industrial7130 } from "./130-industrial-7.ts";

describe("Industrial 7 (GD04-130)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Industrial7130],
      resourceArea: activeResources(4),
      shieldArea: [createMockUnit({ name: "Shield" })],
      deck: 4,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd04Industrial7130));

    expect(p1.getHand()).toHaveLength(1);
  });

  it("【Burst】 offers its owner the choice to deploy this card after a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd04Industrial7130] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd04Industrial7130)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Burst】 leaves this card in trash when its owner declines", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd04Industrial7130] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: false } }));

    expect(p2.getCardZone(gd04Industrial7130)).toBe(`trash:${PLAYER_TWO}`);
  });

  describe("【Activate･Main】【Once per Turn】Exile 1 Command card from your trash：Choose 1 enemy Unit. It gets AP-1 during this turn.", () => {
    it("exiles a Command from trash and gives an enemy Unit AP-1 this turn", () => {
      const command = createMockCommand();
      const enemy = createMockUnit({ ap: 4 });
      const engine = GundamTestEngine.create(
        { baseSection: [gd04Industrial7130], trash: [command], deck: 5 },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const commandId = p1.getCardsInZone("trash")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateBaseAbility(baseId, { targets: [commandId] }));

      expect(p1.getCardZone(commandId)).toBe("removalArea");
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: baseId,
        minTargets: 1,
        maxTargets: 1,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);
    });

    it("cannot activate without a Command card in trash to exile", () => {
      const enemy = createMockUnit({ ap: 4 });
      const engine = GundamTestEngine.create(
        { baseSection: [gd04Industrial7130] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(gd04Industrial7130, { targets: [enemyId] }),
        "COST_NOT_PAYABLE",
      );
    });

    it("rejects friendly Unit targets", () => {
      const command = createMockCommand();
      const friendly = createMockUnit({ ap: 4 });
      const enemy = createMockUnit({ ap: 4 });
      const engine = GundamTestEngine.create(
        {
          baseSection: [gd04Industrial7130],
          play: [friendly],
          trash: [command],
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const commandId = p1.getCardsInZone("trash")[0]!;
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateBaseAbility(baseId, { targets: [commandId] }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });

      expectFailure(p1.resolveEffect({ targets: [friendlyId] }), "ILLEGAL_TARGET");
      expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "targetSelection" });
      expect(p1.getVisibleCard(friendlyId)?.effectiveAp).toBe(4);
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);
    });
  });
});
