import { describe, it } from "vite-plus/test";
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
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05AtTheRiskOfOneSLife104 } from "./104-at-the-risk-of-one-s-life.ts";

describe("At the Risk of One's Life (GD05-104)", () => {
  describe("【Action】Choose 1 friendly (Shrike Team) Unit. It gains … Destroyed → set League Militaire active", () => {
    it("sets a League Militaire Unit active when the chosen linked Shrike Team Unit is destroyed", () => {
      const shrike = createMockUnit({
        traits: ["shrike team"],
        hp: 2,
        linkCondition: "[Test Pilot]",
      });
      const pilot = createMockPilot({ name: "Test Pilot", cost: 0 });
      const league = createMockUnit({ traits: ["league militaire"], hp: 5 });
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot, gd05AtTheRiskOfOneSLife104],
          play: [
            { card: shrike, exhausted: true },
            { card: league, exhausted: true },
          ],
          resourceArea: activeResources(3),
          deck: 5,
        },
        { play: [attacker], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.assignPilot(pilot, shrike);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      p2.must.attack(attacker).into(shrike);
      p1.must.passBlock();
      p1.must.playCommand(gd05AtTheRiskOfOneSLife104);
      expectPublicLog(engine, "gundam.move.playCommand", { playerId: PLAYER_ONE });
      p1.must.resolveTargets(shrike);
      p2.must.passBattleAction();
      p1.must.passBattleAction();
      p1.must.resolveTargets(league);

      expectCard(p1, shrike).toBeIn("trash");
      expectCard(p1, league).toBeReady();
    });

    it("cannot be played during Main (Action-only timing)", () => {
      const shrike = createMockUnit({ traits: ["shrike team"], hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd05AtTheRiskOfOneSLife104],
        play: [shrike],
        resourceArea: activeResources(3),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectFailure(p1.playCommand(gd05AtTheRiskOfOneSLife104), "WRONG_TIMING");
    });

    it("rejects a non-Shrike Team Unit as the Action grant target", () => {
      const nonShrike = createMockUnit({ traits: ["earth federation"], hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05AtTheRiskOfOneSLife104],
          play: [nonShrike],
          resourceArea: activeResources(3),
          deck: 5,
        },
        { play: [createMockUnit({ ap: 1, hp: 5 })], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      // Reach End-phase Action Step through public passes
      p1.must.passPhase();
      p2.must.passActionStep();
      expectFailure(
        p1.playCommand(gd05AtTheRiskOfOneSLife104, {
          targets: [p1.unit(nonShrike).instanceId],
        }),
        "INVALID_TARGET",
      );
    });
  });

  describe("【Pilot】[Helen Jackson]", () => {
    it("can be paired as a Pilot onto a friendly Unit", () => {
      const host = createMockUnit({ ap: 2, hp: 4 });
      const engine = GundamTestEngine.create({
        hand: [gd05AtTheRiskOfOneSLife104],
        play: [host],
        resourceArea: activeResources(3),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      p1.must.playCommandAsPilot(gd05AtTheRiskOfOneSLife104, host);
      expectCard(p1, host).toHavePilot().toHaveAp(3);
    });
  });
});
