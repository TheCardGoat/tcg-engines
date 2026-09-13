import { describe, expect, it } from "vite-plus/test";
import {
  createMockPilot,
  createMockUnit,
  expectCard,
  expectLogType,
  expectPlayer,
  expectPublicLog,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05GundamAge2NormalSpVer024 } from "./024-gundam-age-2-normal-sp-ver.ts";

describe("Gundam AGE-2 Normal (SP Ver.) (GD05-024)", () => {
  describe("【Destroyed】Choose 1 green (Earth Federation) Pilot card from your trash. Add it to your hand. If you do, discard 1.", () => {
    it("recovers only a green Earth Federation Pilot, then discards one chosen card", () => {
      const fodder = createMockUnit({ name: "Discard Fodder" });
      const eligible = createMockPilot({ color: "green", traits: ["earth federation"] });
      const wrongColor = createMockPilot({ color: "blue", traits: ["earth federation"] });
      const wrongTrait = createMockPilot({ color: "green", traits: ["academy"] });
      const attacker = createMockUnit({ ap: 10, hp: 10 });
      const engine = GundamTestEngine.create(
        {
          hand: [fodder],
          play: [gd05GundamAge2NormalSpVer024],
          trash: [eligible, wrongColor, wrongTrait],
          deck: 3,
          shieldArea: [createMockUnit()],
        },
        { play: [attacker], deck: 3, shieldArea: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [
        p1.unit(gd05GundamAge2NormalSpVer024).instanceId,
      ]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      p2.must.attack(attacker).into(gd05GundamAge2NormalSpVer024);
      expectPublicLog(engine, "gundam.move.attackDeclared", {
        attackerPlayerId: PLAYER_TWO,
      });
      p1.must.passBlock().passBattleAction();
      p2.must.passBattleAction();
      expectLogType(engine, "gundam.combat.unitDefeated", { min: 1 });
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [p1.cardIn("trash", eligible).instanceId],
      });
      p1.must.resolveTargets(eligible);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: expect.arrayContaining([
          p1.cardIn("hand", fodder).instanceId,
          p1.cardIn("hand", eligible).instanceId,
        ]),
      });
      p1.must.resolveTargets(fodder);

      expectCard(p1, gd05GundamAge2NormalSpVer024).toBeIn("trash");
      expectCard(p1, eligible).toBeIn("hand");
      expectCard(p1, fodder).toBeIn("trash");
      expectCard(p1, wrongColor).toBeIn("trash");
      expectCard(p1, wrongTrait).toBeIn("trash");
    });

    it("resolves without a discard prompt when no eligible Pilot is in trash", () => {
      const fodder = createMockUnit({ name: "Hand Fodder" });
      const wrongColor = createMockPilot({ color: "blue", traits: ["earth federation"] });
      const wrongTrait = createMockPilot({ color: "green", traits: ["academy"] });
      const attacker = createMockUnit({ ap: 10, hp: 10 });
      const engine = GundamTestEngine.create(
        {
          hand: [fodder],
          play: [gd05GundamAge2NormalSpVer024],
          trash: [wrongColor, wrongTrait],
          deck: 3,
          shieldArea: [createMockUnit()],
        },
        { play: [attacker], deck: 3, shieldArea: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [
        p1.unit(gd05GundamAge2NormalSpVer024).instanceId,
      ]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      p2.must.attack(attacker).into(gd05GundamAge2NormalSpVer024);
      p1.must.passBlock().passBattleAction();
      p2.must.passBattleAction();

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expectCard(p1, gd05GundamAge2NormalSpVer024).toBeIn("trash");
      expectCard(p1, fodder).toBeIn("hand");
      expectPlayer(p1).toHaveZoneCount("trash", 3);
    });

    it("discards the recovered Pilot itself when that is the chosen hand card", () => {
      const eligible = createMockPilot({ color: "green", traits: ["earth federation"] });
      const attacker = createMockUnit({ ap: 10, hp: 10 });
      const engine = GundamTestEngine.create(
        {
          play: [gd05GundamAge2NormalSpVer024],
          trash: [eligible],
          deck: 3,
          shieldArea: [createMockUnit()],
        },
        { play: [attacker], deck: 3, shieldArea: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [
        p1.unit(gd05GundamAge2NormalSpVer024).instanceId,
      ]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      p2.must.attack(attacker).into(gd05GundamAge2NormalSpVer024);
      p1.must.passBlock().passBattleAction();
      p2.must.passBattleAction();
      p1.must.resolveTargets(eligible);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [p1.cardIn("hand", eligible).instanceId],
      });
      p1.must.resolveTargets(eligible);

      expectCard(p1, eligible).toBeIn("trash");
      expectPlayer(p1).toHaveHandCount(0);
    });
  });
});
