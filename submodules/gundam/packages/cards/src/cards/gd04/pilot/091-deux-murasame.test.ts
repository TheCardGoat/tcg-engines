import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04DeuxMurasame091 } from "./091-deux-murasame.ts";

describe("Deux Murasame (GD04-091)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04DeuxMurasame091] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toContain(shieldId);
  });

  describe("【Destroyed】Choose 1 undamaged enemy Unit. Deal 1 damage to it.", () => {
    function destroyEnemyUnitCommand() {
      return createMockCommand({
        name: "Destroy Enemy Unit",
        level: 1,
        cost: 1,
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [
              {
                action: {
                  action: "destroy",
                  target: { owner: "opponent", cardType: "unit", count: 1 },
                },
              },
            ],
            sourceText: "【Main】Destroy 1 enemy Unit.",
          },
        ],
      });
    }

    function setup(enemyDamage = 0) {
      const host = createMockUnit({ name: "Deux Host", hp: 4 });
      const enemy = createMockUnit({ name: "Enemy Unit", hp: 4 });
      const destroyCommand = destroyEnemyUnitCommand();
      const engine = GundamTestEngine.create(
        {
          hand: [gd04DeuxMurasame091],
          play: [host],
          resourceArea: activeResources(4),
          deck: 3,
        },
        {
          hand: [destroyCommand],
          play: [{ card: enemy, damage: enemyDamage }],
          resourceArea: activeResources(1),
          deck: 3,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04DeuxMurasame091, hostId));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.playCommand(destroyCommand, { targets: [hostId] }));

      return { p1, p2, hostId, enemyId };
    }

    it("deals 1 damage to an undamaged enemy Unit after a played effect destroys the host", () => {
      const { p1, p2, hostId, enemyId } = setup();

      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p1.getCardZone(hostId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getDamage(enemyId)).toBe(1);
    });

    it("does not damage an enemy Unit that was already damaged", () => {
      const { p1, p2, enemyId } = setup(1);

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(enemyId)).toBe(1);
    });
  });
});
