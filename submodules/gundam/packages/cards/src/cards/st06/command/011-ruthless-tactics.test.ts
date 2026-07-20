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
import { st06RuthlessTactics011 } from "./011-ruthless-tactics.ts";

describe("Ruthless Tactics (ST06-011)", () => {
  describe("【Main】/【Action】Choose 1 to 2 friendly Clan Units; AP+2 this turn", () => {
    it("prompts for one or two legal Units, buffs the chosen one, and moves to trash", () => {
      const first = createMockUnit({ traits: ["clan"], ap: 2 });
      const second = createMockUnit({ traits: ["clan"], ap: 3 });
      const engine = GundamTestEngine.create({
        hand: [st06RuthlessTactics011],
        play: [first, second],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;
      const [firstId, secondId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: commandId,
        legalTargetIds: expect.arrayContaining([firstId, secondId]),
        minTargets: 1,
        maxTargets: 2,
      });
      expectSuccess(p1.resolveEffect({ targets: [secondId!] }));

      expect(p1.getVisibleCard(firstId!)?.effectiveAp).toBe(2);
      expect(p1.getVisibleCard(secondId!)?.effectiveAp).toBe(5);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("applies AP+2 independently to two chosen Clan Units", () => {
      const engine = GundamTestEngine.create({
        hand: [st06RuthlessTactics011],
        play: [
          createMockUnit({ traits: ["clan"], ap: 1 }),
          createMockUnit({ traits: ["clan"], ap: 4 }),
        ],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [firstId, secondId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(st06RuthlessTactics011, { targets: [firstId!, secondId!] }));

      expect(p1.getVisibleCard(firstId!)?.effectiveAp).toBe(3);
      expect(p1.getVisibleCard(secondId!)?.effectiveAp).toBe(6);
    });

    it("rejects zero selections and more than two selections", () => {
      const units = [1, 2, 3].map(() => createMockUnit({ traits: ["clan"] }));
      const engine = GundamTestEngine.create({
        hand: [st06RuthlessTactics011],
        play: units,
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const ids = p1.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(st06RuthlessTactics011, { targets: [] }), "INVALID_TARGET");
      expectFailure(p1.playCommand(st06RuthlessTactics011, { targets: ids }), "INVALID_TARGET");
    });

    it("rejects a friendly non-Clan Unit and an enemy Clan Unit", () => {
      const eligible = createMockUnit({ traits: ["clan"] });
      const nonClan = createMockUnit({ traits: ["zeon"] });
      const enemyClan = createMockUnit({ traits: ["clan"] });
      const engine = GundamTestEngine.create(
        {
          hand: [st06RuthlessTactics011],
          play: [eligible, nonClan],
          resourceArea: activeResources(3),
        },
        { play: [enemyClan] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const nonClanId = p1.getCardsInZone("battleArea")[1]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(st06RuthlessTactics011, { targets: [nonClanId] }),
        "INVALID_TARGET",
      );
      expectFailure(
        p1.playCommand(st06RuthlessTactics011, { targets: [enemyId] }),
        "INVALID_TARGET",
      );
    });

    it("cannot be played when no friendly Clan Unit exists", () => {
      const engine = GundamTestEngine.create({
        hand: [st06RuthlessTactics011],
        play: [createMockUnit({ traits: ["zeon"] })],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st06RuthlessTactics011), "NO_LEGAL_TARGETS");
      expect(p1.getCardZone(st06RuthlessTactics011)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("can be played in a legally reached Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st06RuthlessTactics011],
        play: [createMockUnit({ traits: ["clan"], ap: 2 })],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const targetId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(st06RuthlessTactics011, { targets: [targetId] }));

      expect(p1.getVisibleCard(targetId)?.effectiveAp).toBe(4);
    });

    it("cannot be played during the Block Step before an Action step", () => {
      const engine = GundamTestEngine.create(
        { play: [createMockUnit({ hp: 5 })] },
        {
          hand: [st06RuthlessTactics011],
          play: [createMockUnit({ traits: ["clan"] })],
          resourceArea: activeResources(3),
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));

      expectFailure(
        p2.playCommand(st06RuthlessTactics011, {
          targets: [p2.getCardsInZone("battleArea")[0]!],
        }),
        "WRONG_PHASE",
      );
    });

    it("expires the AP increase when the turn ends", () => {
      const engine = GundamTestEngine.create({
        hand: [st06RuthlessTactics011],
        play: [createMockUnit({ traits: ["clan"], ap: 2 })],
        resourceArea: activeResources(3),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const targetId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.playCommand(st06RuthlessTactics011, { targets: [targetId] }));
      expect(p1.getVisibleCard(targetId)?.effectiveAp).toBe(4);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(targetId)?.effectiveAp).toBe(2);
    });

    it("enforces its printed Lv.3 and cost 1 without moving the source", () => {
      const target = createMockUnit({ traits: ["clan"] });
      const lowLevel = GundamTestEngine.create({
        hand: [st06RuthlessTactics011],
        play: [target],
        resourceArea: activeResources(2),
      }).asPlayer(PLAYER_ONE);
      expectFailure(lowLevel.playCommand(st06RuthlessTactics011), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(lowLevel.getCardZone(st06RuthlessTactics011)).toBe(`hand:${PLAYER_ONE}`);

      const noPayment = GundamTestEngine.create({
        hand: [st06RuthlessTactics011],
        play: [target],
        resourceArea: restedResources(3),
      }).asPlayer(PLAYER_ONE);
      expectFailure(noPayment.playCommand(st06RuthlessTactics011), "INSUFFICIENT_RESOURCES");
      expect(noPayment.getCardZone(st06RuthlessTactics011)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Pilot】[Gaia (GQ)]", () => {
    it("pairs the exact Command as Gaia and applies AP+1/HP+0 without resolving the Command", () => {
      const engine = GundamTestEngine.create({
        hand: [st06RuthlessTactics011],
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
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });
  });
});
