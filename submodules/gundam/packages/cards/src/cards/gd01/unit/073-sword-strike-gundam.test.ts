import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectCard,
  expectFailure,
  expectPublicLog,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd01SwordStrikeGundam073 } from "./073-sword-strike-gundam.ts";

describe("Sword Strike Gundam (GD01-073)", () => {
  describe("【During Link】【Attack】Choose 1 enemy Unit with 2 or less HP. Return it to its owner's hand.", () => {
    it("links with an Earth Alliance Pilot and returns the chosen 2-or-less HP enemy on attack", () => {
      const earthAlliancePilot = createMockPilot({
        traits: ["earth alliance"],
        level: 1,
        cost: 1,
      });
      const battleTarget = createMockUnit({ hp: 6 });
      const firstFrailEnemy = createMockUnit({ hp: 2 });
      const secondFrailEnemy = createMockUnit({ hp: 1 });
      const sturdyEnemy = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd01SwordStrikeGundam073, earthAlliancePilot],
          deck: 2,
          resourceArea: activeResources(4),
          shieldArea: [createMockUnit({ name: "Opening Shield" })],
        },
        {
          play: [battleTarget, firstFrailEnemy, secondFrailEnemy, sturdyEnemy],
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [p2.unit(battleTarget).instanceId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);

      p1.must.deployUnit(gd01SwordStrikeGundam073);
      p1.must.assignPilot(earthAlliancePilot, gd01SwordStrikeGundam073);
      p1.must.attack(gd01SwordStrikeGundam073).into(battleTarget);

      expectPublicLog(engine, "gundam.move.assignPilot", { playerId: PLAYER_ONE });
      expectPublicLog(engine, "gundam.move.attackDeclared", {
        attackerPlayerId: PLAYER_ONE,
      });
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: expect.arrayContaining([
          p2.unit(firstFrailEnemy).instanceId,
          p2.unit(secondFrailEnemy).instanceId,
        ]),
        minTargets: 1,
        maxTargets: 1,
      });
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: expect.not.arrayContaining([
          p2.unit(sturdyEnemy).instanceId,
          p2.unit(battleTarget).instanceId,
        ]),
      });
      p1.must.resolveTargets(secondFrailEnemy);

      expectCard(p2, secondFrailEnemy).toBeIn("hand");
      expectCard(p2, firstFrailEnemy).toBeIn("battleArea");
      expectCard(p2, sturdyEnemy).toBeIn("battleArea");
    });

    it("does not offer a return while paired with a Pilot that does not satisfy Link", () => {
      const wrongPilot = createMockPilot({ traits: ["academy"], level: 1, cost: 1 });
      const battleTarget = createMockUnit({ hp: 6 });
      const frailEnemy = createMockUnit({ hp: 2 });
      const engine = GundamTestEngine.create(
        {
          hand: [wrongPilot],
          deck: 2,
          play: [gd01SwordStrikeGundam073],
          resourceArea: activeResources(1),
          shieldArea: [createMockUnit({ name: "Opening Shield" })],
        },
        { play: [battleTarget, frailEnemy] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [p2.unit(battleTarget).instanceId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);

      p1.must.assignPilot(wrongPilot, gd01SwordStrikeGundam073);
      p1.must.attack(gd01SwordStrikeGundam073).into(battleTarget);

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expectCard(p2, frailEnemy).toBeIn("battleArea");
    });

    it("does not offer a return while unpaired", () => {
      const battleTarget = createMockUnit({ hp: 6 });
      const frailEnemy = createMockUnit({ hp: 2 });
      const engine = GundamTestEngine.create(
        {
          deck: 2,
          play: [gd01SwordStrikeGundam073],
          resourceArea: activeResources(4),
          shieldArea: [createMockUnit({ name: "Opening Shield" })],
        },
        { play: [battleTarget, frailEnemy] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [p2.unit(battleTarget).instanceId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);

      p1.must.attack(gd01SwordStrikeGundam073).into(battleTarget);

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expectCard(p2, frailEnemy).toBeIn("battleArea");
    });

    it("rejects an enemy Unit with more than 2 HP", () => {
      const earthAlliancePilot = createMockPilot({
        traits: ["earth alliance"],
        level: 1,
        cost: 1,
      });
      const battleTarget = createMockUnit({ hp: 6 });
      const frailEnemy = createMockUnit({ hp: 2 });
      const sturdyEnemy = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [earthAlliancePilot],
          deck: 2,
          play: [gd01SwordStrikeGundam073],
          resourceArea: activeResources(1),
          shieldArea: [createMockUnit({ name: "Opening Shield" })],
        },
        { play: [battleTarget, frailEnemy, sturdyEnemy] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [p2.unit(battleTarget).instanceId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);

      p1.must.assignPilot(earthAlliancePilot, gd01SwordStrikeGundam073);
      p1.must.attack(gd01SwordStrikeGundam073).into(battleTarget);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [p2.unit(frailEnemy).instanceId],
      });
      expectFailure(
        p1.resolveEffect({ targets: [p2.unit(sturdyEnemy).instanceId] }),
        "ILLEGAL_TARGET",
      );
      p1.must.resolveTargets(frailEnemy);

      expectCard(p2, frailEnemy).toBeIn("hand");
      expectCard(p2, sturdyEnemy).toBeIn("battleArea");
    });
  });
});
