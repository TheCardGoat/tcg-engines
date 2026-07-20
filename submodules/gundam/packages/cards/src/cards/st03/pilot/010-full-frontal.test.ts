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
import { st03FullFrontal010 } from "./010-full-frontal.ts";

describe("Full Frontal (ST03-010)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds Full Frontal to hand when its controller accepts the revealed Shield prompt", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st03FullFrontal010] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Full Frontal's Burst choice");
      const shieldId = burst.sourceCardId;
      expect(burst.directiveIndex).toBe(-1);
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

      expect(p2.getCardZone(shieldId)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
    });

    it("puts Full Frontal into trash when its controller declines Burst", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st03FullFrontal010] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Full Frontal's Burst choice");
      const shieldId = burst.sourceCardId;
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getCardZone(shieldId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
    });
  });

  describe("【When Paired】You may deploy 1 (Neo Zeon)/(Zeon) Unit card that is Lv.4 or lower from your hand.", () => {
    it("offers and deploys a Zeon Unit from hand without paying that Unit's cost", () => {
      const host = createMockUnit({ name: "Host", ap: 2, hp: 4 });
      const zeon = createMockUnit({ name: "Zeon Candidate", traits: ["zeon"], level: 4, cost: 5 });
      const engine = GundamTestEngine.create({
        hand: [st03FullFrontal010, zeon],
        play: [host],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const [fullFrontalId, zeonId] = p1.getHand();

      expectSuccess(p1.assignPilot(fullFrontalId!, hostId));
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind !== "optional") {
        throw new Error("Expected Full Frontal's optional deploy choice");
      }
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [zeonId],
      });
      expectSuccess(p1.resolveEffect({ targets: [zeonId!] }));

      expect(p1.getCardZone(zeonId!)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
      expect(p1.getPilotId(hostId)).toBe(fullFrontalId);
    });

    it("offers a Neo Zeon Unit at the exact Lv.4 boundary", () => {
      const host = createMockUnit({ name: "Host" });
      const neoZeon = createMockUnit({
        name: "Neo Zeon Candidate",
        traits: ["neo zeon"],
        level: 4,
      });
      const engine = GundamTestEngine.create({
        hand: [st03FullFrontal010, neoZeon],
        play: [host],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const neoZeonId = p1.getHand()[1]!;

      expectSuccess(p1.assignPilot(st03FullFrontal010, hostId));
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind !== "optional") throw new Error("Expected optional deploy choice");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [neoZeonId],
      });
    });

    it("excludes a Unit that has neither Neo Zeon nor Zeon", () => {
      const host = createMockUnit({ name: "Host" });
      const wrongTrait = createMockUnit({
        name: "Earth Federation",
        traits: ["earth federation"],
        level: 4,
      });
      const eligible = createMockUnit({ name: "Zeon", traits: ["zeon"], level: 4 });
      const engine = GundamTestEngine.create({
        hand: [st03FullFrontal010, wrongTrait, eligible],
        play: [host],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const [, wrongTraitId, eligibleId] = p1.getHand();

      expectSuccess(p1.assignPilot(st03FullFrontal010, hostId));
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind !== "optional") throw new Error("Expected optional deploy choice");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [eligibleId],
      });
      expect(p1.getBoardView().pendingChoice).not.toMatchObject({
        legalTargetIds: expect.arrayContaining([wrongTraitId]),
      });
    });

    it("excludes a qualifying-trait Unit above Lv.4", () => {
      const host = createMockUnit({ name: "Host" });
      const tooHigh = createMockUnit({ name: "High Zeon", traits: ["zeon"], level: 5 });
      const eligible = createMockUnit({ name: "Neo Zeon", traits: ["neo zeon"], level: 4 });
      const engine = GundamTestEngine.create({
        hand: [st03FullFrontal010, tooHigh, eligible],
        play: [host],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const [, tooHighId, eligibleId] = p1.getHand();

      expectSuccess(p1.assignPilot(st03FullFrontal010, hostId));
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind !== "optional") throw new Error("Expected optional deploy choice");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [eligibleId],
      });
      expect(p1.getBoardView().pendingChoice).not.toMatchObject({
        legalTargetIds: expect.arrayContaining([tooHighId]),
      });
    });

    it("allows the optional deployment to be declined", () => {
      const host = createMockUnit({ name: "Host" });
      const eligible = createMockUnit({ traits: ["zeon"], level: 4 });
      const engine = GundamTestEngine.create({
        hand: [st03FullFrontal010, eligible],
        play: [host],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const eligibleId = p1.getHand()[1]!;

      expectSuccess(p1.assignPilot(st03FullFrontal010, hostId));
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind !== "optional") throw new Error("Expected optional deploy choice");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: false } }));

      expect(p1.getCardZone(eligibleId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("finishes pairing cleanly when no eligible Unit is in hand", () => {
      const host = createMockUnit({ name: "Host" });
      const wrongTrait = createMockUnit({ traits: ["earth federation"], level: 4 });
      const engine = GundamTestEngine.create({
        hand: [st03FullFrontal010, wrongTrait],
        play: [host],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const fullFrontalId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(fullFrontalId, hostId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getPilotId(hostId)).toBe(fullFrontalId);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 4, effectiveHp: 5 });
    });
  });

  describe("pairing Full Frontal", () => {
    it("cannot pair below its printed Lv.6 requirement", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st03FullFrontal010],
        play: [host],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.assignPilot(st03FullFrontal010, hostId), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st03FullFrontal010)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(hostId)).toBeUndefined();
    });

    it("cannot pay its printed cost without an active Resource", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st03FullFrontal010],
        play: [host],
        resourceArea: restedResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.assignPilot(st03FullFrontal010, hostId), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st03FullFrontal010)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(hostId)).toBeUndefined();
    });

    it("cannot pair during a legally reached Action step", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st03FullFrontal010],
        play: [host],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.assignPilot(st03FullFrontal010, hostId), "WRONG_PHASE");

      expect(p1.getCardZone(st03FullFrontal010)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(hostId)).toBeUndefined();
    });
  });
});
