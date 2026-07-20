import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st08WordsForHathaway012 } from "./012-words-for-hathaway.ts";

describe("Words for Hathaway (ST08-012)", () => {
  describe("【Main】Choose 1 friendly Link Unit. It gains <Breach 1> during this turn.", () => {
    it("grants Breach 1 to the chosen friendly Link Unit", () => {
      const pilot = createMockPilot({ name: "Link Pilot", level: 1, cost: 1 });
      const linkUnit = createMockUnit({ ap: 3, hp: 5, linkCondition: "[Link Pilot]" });
      const otherUnit = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [pilot, st08WordsForHathaway012],
        play: [linkUnit, otherUnit],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [linkId, otherId] = p1.getCardsInZone("battleArea");
      expectSuccess(p1.assignPilot(pilot, linkId!));

      expectSuccess(p1.playCommand(st08WordsForHathaway012, { targets: [linkId!] }));

      expect(p1.getVisibleCard(linkId!)?.keywords).toContain("Breach");
      expect(p1.getVisibleCard(otherId!)?.keywords).not.toContain("Breach");
    });

    it("publishes an exact-one controller/source choice of friendly Link Units", () => {
      const pilot = createMockPilot({ name: "Link Pilot", level: 1, cost: 1 });
      const first = createMockUnit({ linkCondition: "[Link Pilot]" });
      const second = createMockUnit({ linkCondition: "[Link Pilot]" });
      const engine = GundamTestEngine.create({
        hand: [pilot, pilot, st08WordsForHathaway012],
        play: [first, second, createMockUnit()],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [firstId, secondId] = p1.getCardsInZone("battleArea");
      expectSuccess(p1.assignPilot(p1.getHand()[0]!, firstId!));
      expectSuccess(p1.assignPilot(p1.getHand()[0]!, secondId!));
      const commandId = p1.getHand()[0]!;
      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: commandId,
        minTargets: 1,
        maxTargets: 1,
        legalTargetIds: [firstId, secondId],
      });
    });

    it("uses granted Breach 1 to destroy one Shield after battle destruction", () => {
      const pilot = createMockPilot({ name: "Link Pilot", level: 1, cost: 1, apBonus: 0 });
      const unit = createMockUnit({ ap: 3, hp: 5, linkCondition: "[Link Pilot]" });
      const engine = GundamTestEngine.create(
        { hand: [pilot, st08WordsForHathaway012], play: [unit], resourceArea: activeResources(3) },
        {
          play: [{ card: createMockUnit({ ap: 0, hp: 3 }), exhausted: true }],
          shieldArea: [createMockUnit()],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, unitId));
      expectSuccess(p1.playCommand(st08WordsForHathaway012, { targets: [unitId] }));
      expectSuccess(p1.enterBattle(unitId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    });

    it("rejects an enemy Link Unit", () => {
      const pilot = createMockPilot({ name: "Link Pilot" });
      const enemy = createMockUnit({ linkCondition: "[Link Pilot]" });
      const engine = GundamTestEngine.create(
        { hand: [st08WordsForHathaway012], resourceArea: activeResources(3) },
        { hand: [pilot], play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectFailure(
        p1.playCommand(st08WordsForHathaway012, {
          targets: [engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!],
        }),
        "INVALID_TARGET",
      );
    });

    it("rejects a friendly Unit that is not a Link Unit", () => {
      const unit = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st08WordsForHathaway012],
        play: [unit],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(st08WordsForHathaway012, { targets: [unitId!] }),
        "INVALID_TARGET",
      );
    });

    it("cannot be played at action timing", () => {
      const pilot = createMockPilot({ name: "Link Pilot", level: 1, cost: 1 });
      const linkUnit = createMockUnit({ ap: 3, hp: 5, linkCondition: "[Link Pilot]" });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot, st08WordsForHathaway012],
          play: [linkUnit],
          resourceArea: activeResources(3),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [linkId] = p1.getCardsInZone("battleArea");
      const [defenderId] = p2.getCardsInZone("battleArea");
      expectSuccess(p1.assignPilot(pilot, linkId!));
      expectSuccess(p1.enterBattle(linkId!, defenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());

      expectFailure(
        p1.playCommand(st08WordsForHathaway012, { targets: [linkId!] }),
        "WRONG_TIMING",
      );
    });

    it("cannot be played without a friendly Link Unit", () => {
      const engine = GundamTestEngine.create({
        hand: [st08WordsForHathaway012],
        play: [createMockUnit()],
        resourceArea: activeResources(3),
      });
      expectFailure(
        engine.asPlayer(PLAYER_ONE).playCommand(st08WordsForHathaway012),
        "NO_LEGAL_TARGETS",
      );
    });
  });

  describe("【Pilot】[Gawman Nobile]", () => {
    it("pairs through the public Command-as-Pilot move and grants AP+1/HP+0", () => {
      const engine = GundamTestEngine.create({
        hand: [st08WordsForHathaway012],
        play: [createMockUnit({ ap: 2, hp: 3 })],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, hostId));

      expect(p1.getPilotId(hostId)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
    });
  });

  it("requires Lv.3 and one active resource in command mode", () => {
    const low = GundamTestEngine.create({
      hand: [st08WordsForHathaway012],
      play: [createMockUnit({ linkCondition: "[Pilot]" })],
      resourceArea: activeResources(2),
    });
    expectFailure(
      low.asPlayer(PLAYER_ONE).playCommand(st08WordsForHathaway012),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    const rested = GundamTestEngine.create({
      hand: [st08WordsForHathaway012],
      play: [createMockUnit({ linkCondition: "[Pilot]" })],
      resourceArea: restedResources(3),
    });
    expectFailure(
      rested.asPlayer(PLAYER_ONE).playCommand(st08WordsForHathaway012),
      "INSUFFICIENT_RESOURCES",
    );
  });
});
