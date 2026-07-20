import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st03Indignation012 } from "./012-indignation.ts";

describe("Indignation (ST03-012)", () => {
  describe("【Main】/【Action】Choose 1 friendly Unit. It gets AP+2 during this turn.", () => {
    it("gives exactly the chosen friendly Unit AP+2 during Main and moves Indignation to trash", () => {
      const first = createMockUnit({ name: "First Friendly", ap: 2, hp: 5 });
      const second = createMockUnit({ name: "Second Friendly", ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st03Indignation012],
        play: [first, second],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;
      const [firstId, secondId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: expect.arrayContaining([firstId, secondId]),
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [secondId!] }));

      expect(p1.getVisibleCard(firstId!)?.effectiveAp).toBe(2);
      expect(p1.getVisibleCard(secondId!)?.effectiveAp).toBe(5);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("gives a friendly Unit AP+2 during a legally reached Action step", () => {
      const friendly = createMockUnit({ name: "Friendly", ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st03Indignation012],
        play: [friendly],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(commandId, { targets: [friendlyId] }));

      expect(p1.getVisibleCard(friendlyId)?.effectiveAp).toBe(4);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("rejects an enemy Unit", () => {
      const friendly = createMockUnit({ name: "Friendly", ap: 2, hp: 5 });
      const enemy = createMockUnit({ name: "Enemy", ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03Indignation012],
          play: [friendly],
          resourceArea: activeResources(2),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(commandId, { targets: [enemyId] }), "INVALID_TARGET");

      expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
    });

    it("cannot be played when there is no friendly Unit to choose", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Indignation012],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st03Indignation012), "NO_LEGAL_TARGETS");
      expect(p1.getCardZone(st03Indignation012)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("rejects choosing more than one friendly Unit", () => {
      const first = createMockUnit({ name: "First Friendly" });
      const second = createMockUnit({ name: "Second Friendly" });
      const engine = GundamTestEngine.create({
        hand: [st03Indignation012],
        play: [first, second],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;
      const targetIds = p1.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(commandId, { targets: targetIds }), "INVALID_TARGET");

      expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("removes the AP increase at the end of the turn", () => {
      const friendly = createMockUnit({ name: "Friendly", ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03Indignation012],
          play: [friendly],
          resourceArea: activeResources(2),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(st03Indignation012, { targets: [friendlyId] }));
      expect(p1.getVisibleCard(friendlyId)?.effectiveAp).toBe(4);
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(friendlyId)?.effectiveAp).toBe(2);
    });

    it("cannot be played below its printed Lv.2 requirement", () => {
      const friendly = createMockUnit({ name: "Friendly" });
      const engine = GundamTestEngine.create({
        hand: [st03Indignation012],
        play: [friendly],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(st03Indignation012, { targets: [friendlyId] }),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
      expect(p1.getCardZone(st03Indignation012)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without an active Resource", () => {
      const friendly = createMockUnit({ name: "Friendly" });
      const engine = GundamTestEngine.create({
        hand: [st03Indignation012],
        play: [friendly],
        resourceArea: restedResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(st03Indignation012, { targets: [friendlyId] }),
        "INSUFFICIENT_RESOURCES",
      );
      expect(p1.getCardZone(st03Indignation012)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot use Main timing during the opponent's Main Phase", () => {
      const friendly = createMockUnit({ name: "Friendly" });
      const engine = GundamTestEngine.create(
        {
          hand: [st03Indignation012],
          play: [friendly],
          resourceArea: activeResources(2),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectFailure(
        p1.playCommand(st03Indignation012, { targets: [friendlyId] }),
        "NOT_ACTIVE_PLAYER",
      );

      expect(p1.getCardZone(st03Indignation012)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Pilot】[Angelo Sauper]", () => {
    it("can pair as Angelo Sauper instead of resolving the Command effect", () => {
      const host = createMockUnit({
        name: "Angelo Host",
        ap: 2,
        hp: 4,
        linkCondition: "[Angelo Sauper]",
      });
      const engine = GundamTestEngine.create({
        hand: [st03Indignation012],
        play: [host],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, hostId));

      expect(p1.getPilotId(hostId)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    });

    it("cannot pair below Indignation's printed Lv.2 requirement", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st03Indignation012],
        play: [host],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommandAsPilot(st03Indignation012, hostId),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );

      expect(p1.getCardZone(st03Indignation012)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(hostId)).toBeUndefined();
    });

    it("cannot pay the Pilot mode's printed cost without an active Resource", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st03Indignation012],
        play: [host],
        resourceArea: restedResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommandAsPilot(st03Indignation012, hostId), "INSUFFICIENT_RESOURCES");

      expect(p1.getCardZone(st03Indignation012)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(hostId)).toBeUndefined();
    });

    it("cannot pair as a Pilot during a legally reached Action step", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st03Indignation012],
        play: [host],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.playCommandAsPilot(st03Indignation012, hostId), "WRONG_PHASE");

      expect(p1.getCardZone(st03Indignation012)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(hostId)).toBeUndefined();
    });
  });
});
