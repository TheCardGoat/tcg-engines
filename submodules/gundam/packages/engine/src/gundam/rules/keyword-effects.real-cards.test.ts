/**
 * Keyword-effect conformance tests (rules 13-1).
 *
 * Unlike card fixtures, this suite exercises the shared engine with published
 * card definitions and public moves. Card-local tests only need one narrow
 * happy path; these tests retain the keyword timing and legality boundaries.
 */

import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "../../index.ts";
import { st01Gundam001 } from "../../../../cards/src/cards/st01/unit/001-gundam.ts";
import { gd05AbyssGundam040 } from "../../../../cards/src/cards/gd05/unit/040-abyss-gundam.ts";
import { gd05DestinyGundam055 } from "../../../../cards/src/cards/gd05/unit/055-destiny-gundam.ts";
import { eb01GquuuuuuxOmegaPsycommu024 } from "../../../../cards/src/cards/eb01/unit/024-gquuuuuux-omega-psycommu.ts";
import { eb01PsychoZakuEx045 } from "../../../../cards/src/cards/eb01/unit/045-psycho-zaku-ex.ts";
import { gd01WingGundamZero024 } from "../../../../cards/src/cards/gd01/unit/024-wing-gundam-zero.ts";
import { gd01SaylaMass087 } from "../../../../cards/src/cards/gd01/pilot/087-sayla-mass.ts";
import { st02SimultaneousFire012 } from "../../../../cards/src/cards/st02/command/012-simultaneous-fire.ts";
import { st10MobileWorkerTekkadan010 } from "../../../../cards/src/cards/st10/unit/010-mobile-worker-tekkadan.ts";
import { st10ZetaGundam002 } from "../../../../cards/src/cards/st10/unit/002-zeta-gundam.ts";

function resolveBattle(engine: GundamTestEngine, attackerId: string, targetId: string): void {
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  expectSuccess(p1.enterBattle(attackerId, targetId));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
}

function endTurn(engine: GundamTestEngine): void {
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  expectSuccess(p1.passPhase());
  expectSuccess(p2.passActionStep());
  expectSuccess(p1.passActionStep());
}

function damageCommand(amount: number) {
  return createMockCommand({
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount,
              target: { owner: "friendly", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `【Main】Deal ${amount} damage to one friendly Unit.`,
      },
    ],
  });
}

describe("Keyword effects with published card fixtures (rules 13-1)", () => {
  describe("<Repair> (13-1-1)", () => {
    it("repairs only at the end of its controller's turn and never below zero damage", () => {
      const damage = damageCommand(1);
      const engine = GundamTestEngine.create(
        { hand: [damage], play: [st01Gundam001], deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const gundamId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(damage));
      expectSuccess(p1.resolveEffect({ targets: [gundamId] }));
      expect(p1.getDamage(gundamId)).toBe(1);
      endTurn(engine);

      expect(p1.getDamage(gundamId)).toBe(0);
    });

    it("adds a real granted Repair value to the printed value instead of making a second trigger", () => {
      const damage = damageCommand(4);
      const engine = GundamTestEngine.create(
        {
          hand: [gd01SaylaMass087, damage],
          play: [st01Gundam001],
          resourceArea: activeResources(4),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const gundamId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd01SaylaMass087, gundamId));
      expectSuccess(p1.playCommand(damage));
      expectSuccess(p1.resolveEffect({ targets: [gundamId] }));
      endTurn(engine);

      // Gundam's printed Repair 2 plus Sayla's granted Repair 1 = Repair 3.
      expect(p1.getDamage(gundamId)).toBe(1);
    });
  });

  describe("<Support> (13-1-3)", () => {
    it("rests its source, buffs exactly one other friendly Unit, and rejects itself", () => {
      const engine = GundamTestEngine.create({
        play: [gd05AbyssGundam040, st10MobileWorkerTekkadan010],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [abyssId, workerId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.useSupport(abyssId!, workerId!));
      expect(p1.isExhausted(abyssId!)).toBe(true);
      expect(p1.getVisibleCard(workerId!)?.effectiveAp).toBe(st10MobileWorkerTekkadan010.ap + 2);
    });

    it("rejects its source as the 'other friendly Unit' target before paying the rest cost", () => {
      const engine = GundamTestEngine.create({
        play: [gd05AbyssGundam040, st10MobileWorkerTekkadan010],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const abyssId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.useSupport(abyssId, abyssId), "ILLEGAL_TARGET");
      expect(p1.isExhausted(abyssId)).toBe(false);
    });
  });

  describe("<Breach> (13-1-2)", () => {
    it("damages a Base before Shields after a real Breach Unit destroys an enemy Unit", () => {
      const defender = createMockUnit({ ap: 0, hp: 1 });
      const base = createMockBase({ hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [eb01GquuuuuuxOmegaPsycommu024] },
        {
          play: [{ card: defender, exhausted: true }],
          baseSection: [base],
          shieldArea: [st10MobileWorkerTekkadan010],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      resolveBattle(engine, attackerId, defenderId);

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getDamage(baseId)).toBe(3);
      expect(p2.getCardsInZone("shieldArea")).toHaveLength(1);
    });

    it("adds a real granted Breach value to the printed Breach value", () => {
      const defender = createMockUnit({ ap: 0, hp: 4 });
      const base = createMockBase({ hp: 10 });
      const engine = GundamTestEngine.create(
        {
          hand: [st02SimultaneousFire012],
          play: [eb01GquuuuuuxOmegaPsycommu024],
          resourceArea: activeResources(4),
        },
        { play: [{ card: defender, exhausted: true }], baseSection: [base] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.playCommand(st02SimultaneousFire012));
      expectSuccess(p1.resolveEffect({ targets: [attackerId] }));
      resolveBattle(engine, attackerId, defenderId);

      // GQuuuuuuX's printed Breach 3 plus Simultaneous Fire's Breach 3 = 6.
      expect(p2.getDamage(baseId)).toBe(6);
    });

    it("still resolves the destruction event when both Units are destroyed, but has no target with no Base or Shields", () => {
      const defender = createMockUnit({ ap: 10, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [eb01GquuuuuuxOmegaPsycommu024] },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      resolveBattle(engine, attackerId, defenderId);

      expect(p1.getCardZone(attackerId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
    });
  });

  describe("<Blocker> and <High-Maneuver> (13-1-4, 13-1-6)", () => {
    it("rests a real Blocker and changes an ordinary direct attack's target", () => {
      const engine = GundamTestEngine.create(
        { play: [gd05DestinyGundam055] },
        { play: [st10MobileWorkerTekkadan010] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(blockerId));
      expect(p2.isExhausted(blockerId)).toBe(true);
      expect(p1.getBoardView().pendingCombat).toMatchObject({ blockerId });
    });

    it("redirects an ordinary direct attack but cannot redirect a High-Maneuver attack", () => {
      const engine = GundamTestEngine.create(
        { play: [gd01WingGundamZero024] },
        { play: [st10MobileWorkerTekkadan010] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
      expect(p2.isExhausted(blockerId)).toBe(false);
    });
  });

  describe("<First Strike> (13-1-5)", () => {
    it("uses the real First Strike Unit's damage first, preventing lethal return damage", () => {
      const defender = createMockUnit({ ap: 10, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd05DestinyGundam055] },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      resolveBattle(engine, attackerId, defenderId);

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getCardZone(attackerId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getDamage(attackerId)).toBe(0);
    });

    it("still receives return damage when its first damage does not destroy the defender", () => {
      const defender = createMockUnit({ ap: 3, hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [gd05DestinyGundam055] },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      resolveBattle(engine, attackerId, defenderId);

      expect(p1.getDamage(attackerId)).toBe(1);
      expect(p2.getDamage(defenderId)).toBe(5);
    });
  });

  describe("<Suppression> (13-1-7)", () => {
    it("destroys exactly the available first two Shields without a hidden target choice", () => {
      const engine = GundamTestEngine.create(
        { play: [eb01PsychoZakuEx045] },
        {
          shieldArea: [
            st10MobileWorkerTekkadan010,
            st10MobileWorkerTekkadan010,
            st10MobileWorkerTekkadan010,
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      resolveBattle(engine, attackerId, "direct");

      expect(p2.getCardsInZone("shieldArea")).toHaveLength(1);
      expect(p2.getCardsInZone("trash")).toHaveLength(2);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("damages only the available Shield when exactly one remains", () => {
      const engine = GundamTestEngine.create(
        { play: [eb01PsychoZakuEx045] },
        { shieldArea: [st10MobileWorkerTekkadan010] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      resolveBattle(engine, attackerId, "direct");

      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
      expect(p2.getCardsInZone("trash")).toHaveLength(1);
      expect(p1.getBoardView().winner).toBeUndefined();
    });
  });

  describe("Development (13-1-8)", () => {
    it("exiles the required real G Generation cards before exposing its following target", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st10ZetaGundam002],
          trash: [st10ZetaGundam002, st10ZetaGundam002],
          resourceArea: activeResources(5),
        },
        { play: [st10MobileWorkerTekkadan010] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zetaId = p1.getHand()[0]!;
      const trashIds = p1.getCardsInZone("trash");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(zetaId));
      const development = p1.getBoardView().pendingChoice;
      if (
        development?.kind !== "targetSelection" ||
        development.optionalDirectiveIndex === undefined
      ) {
        throw new Error("Expected the optional Development exile choice");
      }
      expectSuccess(
        p1.resolveEffect({
          optionalAnswers: { [development.optionalDirectiveIndex]: true },
          targets: trashIds,
        }),
      );
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(trashIds.every((id) => p1.getCardZone(id) === "removalArea")).toBe(true);
      expect(p2.isExhausted(enemyId)).toBe(true);
    });

    it("does not expose the post-Development effect when its optional exile is declined", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st10ZetaGundam002],
          trash: [st10ZetaGundam002, st10ZetaGundam002],
          resourceArea: activeResources(5),
        },
        { play: [st10MobileWorkerTekkadan010] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const trashIds = p1.getCardsInZone("trash");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(st10ZetaGundam002));
      const development = p1.getBoardView().pendingChoice;
      if (
        development?.kind !== "targetSelection" ||
        development.optionalDirectiveIndex === undefined
      ) {
        throw new Error("Expected the optional Development exile choice");
      }
      expectSuccess(
        p1.resolveEffect({ optionalAnswers: { [development.optionalDirectiveIndex]: false } }),
      );

      expect(p1.getCardsInZone("trash")).toEqual(trashIds);
      expect(p2.isExhausted(enemyId)).toBe(false);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });
  });
});
